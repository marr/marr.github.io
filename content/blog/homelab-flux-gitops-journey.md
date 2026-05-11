---
title: "Building a Homelab with Flux GitOps: Lessons from Three Months"
description: How I built a home Kubernetes cluster with Flux, SOPS secrets, and a dashboard that actually works — plus the skills that helped document everything along the way.
date: 2026-04-29T00:00:00.000Z
---

I've been running a homelab for a few years, but this March I decided to do it properly. Talos Linux on a Mac Mini, Flux for GitOps, SOPS for secrets, and a homepage dashboard that shows everything at a glance.

Three months in, I have a working cluster with Immich, Plex, Grafana, CrowdSec, Traefik, and a handful of other services. More importantly, I have documentation that actually compounds — each problem I solved made the next one easier.

Here's what I built, what broke, and how I'll do it again.

## The Stack

- **Talos Linux** — Immutable, API-driven Kubernetes. No SSH, no shell, no apt-get. Sounds limiting until you realize you never need to debug "what changed on the node."
- **Flux** — GitOps via the **Flux Operator**: a `FluxInstance` CR installs controllers and points **sync** at your Git (or OCI) path. Everything still lives in git; push a change, it lands. Revert, it's gone.
- **SOPS + Age** — Encrypted secrets in git. No plaintext, no sealed-secrets complexity. Decrypt with your age key, apply, done.
- **Homepage** — Dashboard with widgets for every service. Internal URLs, API tokens, done.
- **Traefik** — Ingress with ACME DNS challenges for `*.example.com` certs.
- **CrowdSec** — Bouncer + LAPI for intrusion detection at the edge.

## The Journey (aka Things That Broke)

### Storage Classes Matter More Than You Think

Early mistake: I used NFS (`nfs-synology`) for everything. Loki crashed in a persistent loop with `directory not empty` errors. PostgreSQL had WAL corruption.

The problem: NFS lacks POSIX fsync/locking semantics. Databases need them.

| Storage Class | Use For | Don't Use For |
|---|---|---|
| `local-path` | Databases, WAL, TSDB | — |
| `nfs-synology` | Photo libraries, bulk storage | Anything with strict fsync |

**Lesson**: `local-path` for databases, NFS for everything else. One decision fixed a week of crash loops.

### Node Scheduling Has Layers

The cluster went through four scheduling strategies:

1. Worker node only — simple, single point of failure
2. All nodes with control-plane tolerations — apps ran on control plane, messy
3. Worker-only apps — clean isolation
4. Monitoring on control plane — freed worker resources when I ran out

**Current rule**: Apps on workers. Monitoring on control plane. Documented exceptions in HelmRelease comments.

### Helm upgrades when charts drop resources

A concrete example: the OpenTelemetry operator chart upgrade (0.109 → 0.110) removed `kube-rbac-proxy`, which changed Service port layouts. Helm left stale listening paths behind, and reconciling produced confusing failures until the rendered chart and cluster state agreed.

**What fixed it:** Read the chart changelog before bumping versions; pin if you are unsure. For day-to-day HelmReleases, use **`spec.install.strategy`** and **`spec.upgrade.strategy`** with **`name: RetryOnFailure`** (and a **`retryInterval`**) so failed applies retry without uninstalling the release. When a chart **stops owning** objects it used to manage (sidecars, old Services), set **`spec.upgrade.force: true`** on that upgrade so Helm can replace conflicting resources — then drop `force` again once the release is healthy.

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: example-operator
  namespace: observability
spec:
  interval: 30m
  chart:
    spec:
      chart: opentelemetry-operator
      version: "0.109.x"
      sourceRef:
        kind: HelmRepository
        name: open-telemetry
      interval: 10m
  install:
    timeout: 10m
    strategy:
      name: RetryOnFailure
      retryInterval: 5m
  upgrade:
    timeout: 10m
    force: true
    strategy:
      name: RetryOnFailure
      retryInterval: 5m
```

**Lesson:** Treat chart upgrades that remove workloads or change discovery ports as infrastructure changes, not just a semver bump.

### Synology + Traefik = Special Handling

Getting Traefik to proxy Synology DSM/Drive required three specific fixes:

1. **No CrowdSec on Synology routes** — DSM's WebSocket-based UI and asset loading break with request inspection middleware
2. **Disable HTTP/2 upstream** — Some DSM builds have HTTP/2 bugs causing connection failures
3. **EndpointSlice-only** — Mixing v1 `Endpoints` with `EndpointSlice` causes ~50% 502s when IPs differ

```yaml
apiVersion: traefik.io/v1alpha1
kind: ServersTransport
metadata:
  name: synology-insecure
  namespace: traefik
spec:
  insecureSkipVerify: true
  disableHTTP2: true
```

**Cluster hygiene tip:** If you ever have ~50% 502s on a route, check for mixed Endpoints + EndpointSlice:
```bash
kubectl get endpoints -n traefik synology-dsm  # Delete if present
```

Manually created Endpoints spawn a mirrored EndpointSlice via `endpointslicemirroring-controller`. Delete the Endpoints object and rely on Git-managed EndpointSlice only.

### The VoidAuth Hairpin (CoreDNS Split-Horizon)

Initial VoidAuth setup had 700-900ms latency on unauthenticated requests. Root cause: `APP_URL=https://auth.example.com` caused internal requests to hairpin NAT — out to the public IP and back.

**Fix: CoreDNS split-horizon** to resolve `auth.example.com` to the Traefik ClusterIP internally:

```yaml
# infrastructure/configs/coredns.yaml
data:
  Corefile: |
    .:53 {
        # ... other config ...
        template IN A auth.example.com {
            answer "{{ .Name }} 30 IN A 10.101.208.179"  # Traefik ClusterIP
        }
        forward . /etc/resolv.conf
        # ...
    }
```

**Result:** p99 latency reduced from 1.2s → ~300ms (3-4x faster).

## What Actually Worked

### SOPS for Secrets

SOPS with Age keys is dead simple. One gotcha: there's no `sops --delete` command. The workaround:

```bash
# Decrypt
SOPS_AGE_KEY_FILE=~/.config/sops/age/keys.txt sops -d file.sops.yaml > /tmp/plain.yaml
# Edit
vim /tmp/plain.yaml
# Re-encrypt (filename must match .sops.yaml path regex)
cp /tmp/plain.yaml /tmp/plain.yaml.sops.yaml
SOPS_AGE_KEY_FILE=~/.config/sops/age/keys.txt sops --config .sops.yaml -e /tmp/plain.yaml.sops.yaml > file.sops.yaml
```

Annoying but reliable. Documented it once, never had to figure it out again.

### Homepage Widgets & Secret Management

Once you understand the rules, Homepage is great:

- Secret keys must be prefixed `HOMEPAGE_VAR_` for template substitution
- Use internal service URLs (`http://service.namespace.svc.cluster.local`)
- `subPath` mounts don't hot-reload — Reloader handles this automatically

**Gotcha: Complete secret updates** — When updating Homepage secrets, don't patch individual fields. Delete and recreate the secret to ensure all credentials are present:

```bash
kubectl delete secret -n homepage homepage-secrets
kubectl apply -f new-secret.yaml  # With ALL credentials from SOPS
kubectl rollout restart -n homepage deployment/homepage
```

This prevents the "missing credentials" issue where widgets show 401 errors because only some secrets were updated.

Widgets for Immich, Grafana, Traefik, CrowdSec, Plex, and Synology all working.

### Flux Reconciliation

The workflow is muscle memory now:

```bash
# Edit the repo
# Commit and push
git add -A && git commit -m "feat: add thing" && git push

# Reconcile (namespace matches where your Kustomization lives, often flux-system)
flux reconcile kustomization apps -n flux-system --with-source

# Verify
kubectl get helmrelease -A
```

### Flux Web UI

Flux has a built-in web UI (provided by the flux-operator) that shows the status of all GitOps resources at a glance. It's accessible at `flux.example.com` and provides:

- **Reconciliation status** — Visual indicators for each Kustomization and HelmRelease
- **Resource details** — Click into any object to see its spec and status
- **Error visibility** — Quickly spot what's failing and why
- **History & events** — See recent reconciliation attempts and outcomes

**The enabling change:** On the `helm.toolkit.fluxcd.io/v2` HelmRelease that installs the flux-instance chart, use **`RetryOnFailure`** for install and upgrade, then set Web UI values:

```yaml
spec:
  install:
    strategy:
      name: RetryOnFailure
      retryInterval: 5m
  upgrade:
    strategy:
      name: RetryOnFailure
      retryInterval: 5m
  values:
    instance:
      web:
        enabled: true
        domain: flux.example.com
```

This deploys the flux-operator UI service in the `flux-system` namespace. The service exposes port `http-web` (typically 8080) and is then exposed externally via Traefik IngressRoute:

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: flux-ui
  namespace: flux-system
spec:
  entryPoints:
    - websecure
  routes:
    - kind: Rule
      match: "Host(`flux.example.com`)"
      services:
        - name: flux-operator
          port: http-web
```

The UI is particularly helpful when debugging stuck reconciliations or understanding why a HelmRelease isn't deploying. It complements the CLI workflow for day-to-day operations.

**Note:** In the anonymized config, this is exposed via Traefik IngressRoute to `flux.example.com` with CrowdSec and VoidAuth protection.

### Custom Grafana Dashboards

Four custom dashboards were built to make monitoring actionable:

- **Homelab Overview** — Single-pane view of cluster health: CPU/memory gauges for control plane and worker nodes, disk usage, and key service status
- **K8s Cluster Health** — Deep dive into Kubernetes resource health, pod counts, and namespace-level metrics
- **Traefik Site Health** — Request rates, response times, error rates, and service-level metrics for all ingress traffic
- **Immich Deep Dive** — Photo library metrics: upload rates, storage usage, transcoding performance, and user activity

Each dashboard is deployed as a ConfigMap with `grafana_dashboard: "1"` label, auto-discovered by Grafana. They're maintained in `infrastructure/configs/grafana-dashboards.yaml` and `traefik-dashboard.yaml`.

**Why custom dashboards?** Standard Kubernetes dashboards show raw metrics; custom dashboards show *your* services in context. When Immich is slow, you can immediately see if it's storage, transcoding, or database queries.

**More details:** See the [flux-homelab-skill Grafana dashboards reference](https://github.com/marr/flux-homelab-skill/blob/main/references/grafana-dashboards.md) for deployment patterns and maintenance.

## Documentation That Compounds

The most valuable output of this project isn't the cluster — it's the `docs/solutions/` directory in your infrastructure repository.

Every time I solved a non-trivial problem, I documented it: the symptoms, what didn't work, the fix, and why it works. This is the **ce:compound** pattern — each solution documented makes the next one faster.

The `flux-homelab` skill (available at [github.com/marr/flux-homelab-skill](https://github.com/marr/flux-homelab-skill)) encapsulates the patterns from this homelab — Flux reconciliation, SOPS secrets, Homepage widgets, and service-specific gotchas. It's like a runbook that travels with the agent.

When I ask "why is Immich down," it knows to check storage class first, then node scheduling, then Flux kustomization health. It remembers that node names changed, that OCI chart sources have two valid patterns, and that CrowdSec blocks `wget` user agents.

**Skill contents include:**
- **Cluster hygiene** — Detecting mixed Endpoints + EndpointSlice issues, orphaned services, hardcoded LAN IPs
- **Flux reconciliation** — Proper sequence for GitRepository → Kustomization → HelmRelease
- **HelmRelease patterns** — `RetryOnFailure` install/upgrade strategies, narrow use of `upgrade.force` when charts drop resources, stuck kustomization recovery
- **Secret management** — SOPS file structure, secret synchronization, validation workflows

The **ce:compound** pattern (referenced from [Compound Engineering](https://every.to/guides/compound-engineering)) is a structured approach to documentation — researching problems, assembling solutions, writing them down, and validating that they work. Each documented solution makes the next one faster. This pattern applies to any project, not just homelabs.

## Getting Started with Flux Homelab Experimentation

If you want to try this yourself:

### 1. Pick Your Platform

**Talos** is great if you want an immutable, API-driven cluster. **k3s** is great if you want something more familiar. Either way, you need:

- A machine (old laptop, NUC, Mac Mini, VM)
- A git repo for your Flux configuration
- Time to break things

### 2. Install Flux with the Flux Operator

The maintained install path is the **Flux Operator**: it owns controller upgrades, wiring, and the **Flux Web UI** knobs you enable on `FluxInstance`. You apply one **`FluxInstance`** named `flux` in `flux-system`; its **`.spec.sync`** is the root Git (or OCI) path for your fleet layout — the same `clusters/my-cluster` idea as before, without `flux bootstrap`.

1. **Install the operator** (Helm is typical; see [Flux Operator installation](https://fluxoperator.dev/docs/installation/) for current commands):

```bash
helm install flux-operator oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator \
  --namespace flux-system --create-namespace
```

2. **Apply a `FluxInstance`** with Git sync pointing at your repo (private repos need a `git-credentials` secret and `pullSecret`). The operator will create the root source and Kustomization for that path:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.x"
    registry: ghcr.io/fluxcd
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
  cluster:
    type: kubernetes
    size: small
  sync:
    kind: GitRepository
    url: https://github.com/your-username/homelab-infra.git
    ref: refs/heads/main
    path: clusters/my-cluster
    # pullSecret: git-credentials  # if the repo is private
```

If you already have an older **CLI bootstrap** install, you do **not** need to rebuild the cluster — use the [migration guide](https://fluxoperator.dev/docs/guides/migration/) to move to `FluxInstance`.

**Flux / GitOps gotchas:**
- **Namespace** — Flux components and the root objects the operator creates live in `flux-system` by default. Some older posts use a `flux` namespace; match your manifests to what the operator actually created.
- **Kustomize** — Reconciliation is controller-side; you do not need a separate `kustomize` CLI loop for Flux to apply.
- **Git credentials** — Use a Kubernetes Secret referenced by `pullSecret` for private Git; prefer narrow-scoped credentials and [Flux docs on Git auth](https://fluxcd.io/flux/components/source/gitrepositories/) for provider-specific options.
- **Path separators** — Use forward slashes even on Windows; Flux paths are Git repository paths, not filesystem paths.
- **OCI chart sources** — Flux uses `source.toolkit.fluxcd.io/v1` for GitRepository/HelmRepository/OCIRepository and `helm.toolkit.fluxcd.io/v2` for HelmRelease. OCI-backed charts have two valid patterns: `HelmRepository` with `type: oci`, or `OCIRepository` directly. If one pattern fails, try the other.
- **HelmRelease strategies** — Prefer **`spec.install.strategy`** and **`spec.upgrade.strategy`** with **`name: RetryOnFailure`** (and **`retryInterval`**). Use **`spec.upgrade.force: true`** only when a chart stops owning objects it previously created, then remove it once the release is clean.
- **Stuck kustomizations** — If a `HelmRelease` health check fails, downstream kustomizations with `spec.dependsOn` will wait indefinitely. Check `kubectl describe kustomization <name> -n flux-system` for `HealthCheckFailed`. High `helm-controller` CPU often indicates a failing Helm release in a retry loop.

### 3. Structure Your Repo

```
homelab-infra/
├── clusters/           # Cluster root (path referenced by FluxInstance .spec.sync)
├── infrastructure/
│   ├── controllers/    # Traefik, Prometheus, etc.
│   └── configs/        # Routes, monitoring, alerts
└── apps/
    └── my-app/         # namespace, kustomization, helmrelease
```

### 4. Add SOPS Early

Set up age encryption before you have any secrets:

```bash
age-keygen -o ~/.config/sops/age/keys.txt
# Add the public key to .sops.yaml
```

### 5. Build Incrementally

Don't try to deploy everything at once. Start with:

1. Traefik (ingress)
2. One app (immich, nextcloud, whatever)
3. Homepage (dashboard)
4. Monitoring (Prometheus + Grafana)
5. Security (CrowdSec + auth)

Each step teaches you something. Document each step.

### 6. Document as You Go

Create a `docs/solutions/` directory in your repo. When you solve something non-trivial, write it down. Use YAML frontmatter so future-you (or your AI assistant) can search by module, tags, and problem type.

The compounding effect is real. Week 1 I spent hours debugging Loki crash loops. Week 12, I checked the documented solution and fixed a similar issue in minutes.

## What's Next

The cluster keeps growing. Next up:

- Gitea Actions for CI (self-hosted runners in-cluster)
- Synology Drive integration (finally got the Traefik routing right)
- Better alerting rules in Alertmanager
- Maybe a second node for actual HA

The homelab isn't a project with an end state. It's an ongoing experiment where each iteration teaches something new. The key is capturing those lessons so they compound.

---

*For more on AI-assisted development, see my post on [Building a Knowledge Graph with Obsidian and MCP](/blog/knowledge-graph-obsidian-mcp).*
