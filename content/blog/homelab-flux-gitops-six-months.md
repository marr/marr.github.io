---
title: "Homelab GitOps, Six Months In: Progress is progress"
description: Six months into the Flux/Talos homelab. Self-hosted apps are now just a prompt away.
date: 2026-07-27T00:00:00.000Z
---

Three months in, I wrote about getting a homelab cluster running — Talos Linux, Flux GitOps, SOPS secrets, a homepage dashboard that mostly worked. The honest pitch was "things that broke, and how I'll do it again."

Six months in, the cluster is boring. That's the whole point of GitOps, supposedly, but I didn't expect to feel it. Nothing crashes in the night. Nothing needs a weekend. The interesting stories are no longer *things that broke* — they're *times the cluster lied to me*. Blamed the wrong component. Hid a root cause behind a plausible-looking symptom. Made me confident and wrong.

The best thing I built this quarter isn't a service. It's a `docs/solutions/` directory that caught me being wrong, months after I wrote the wrong thing down. That's the compounding-documentation thesis from last time, but the honest version: documentation doesn't make you smart. It makes your future self slightly less dumb, on a delay.

Here's what changed, what stalled, and what my own notes caught me lying about.

## The Skill Stack Grew Layers

Three months ago I had one custom skill — `homelab-flux` — and the `ce:compound` habit of writing solutions down. That was the whole agent surface. Cute, but it depended on my laptop and my memory of which doc lived where.

Since then the skill layer grew actual structure, and I think this is the most under-told part of running a mature homelab:

- **Three official FluxCD agent skills** — `gitops-cluster-debug`, `gitops-knowledge`, `gitops-repo-audit`. Added in May, vendored and hash-locked in `skills-lock.json`. They travel with the repo, not the machine. If my laptop dies, the next agent that opens the repo gets the same debugging runbook I do.
- `homelab-flux` **promoted in-repo.** It used to live at the user level — my machine, my problem. Now it lives inside the infra repo, so the runbook travels with the cluster state it describes. If the cluster and the runbook ever disagree, at least they're disagreeing in the same git history.
- **A custom** `crowdsec` **skill** — earned its own skill with a full reference tree (`appsec/`, `configure/`, `debug/`, `install/`, `migrate/`, `operate/`) because CrowdSec's scope outgrew a single solution doc and I refused to remember it all. More on that in the security section.

Skills are now infrastructure. An agent debugging my cluster reads the same runbook I would, applies the same "check storage class first, then node scheduling, then Flux health" sequence I would. This is either reassuring or a sign I've automated away my own hobby. Possibly both.

## Flux Bootstrap → Flux Operator (the migration that quieted things)

In May I cut over from the Flux CLI's bootstrap flow to the Flux Operator. The old setup had `gotk-sync.yaml` — a CLI-generated `GitRepository` + `Kustomization` — holding the sync. The new setup has a `flux-instance` HelmRelease owning it:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: flux-instance
  namespace: flux-system
spec:
  # ... chart config ...
  values:
    instance:
      sync:
        kind: GitRepository
        url: https://github.com/your-username/homelab-infra
        ref:
          branch: main
        path: ./clusters/homelab
```

The bootstrap manifests left Git entirely. Flux now manages Flux, declaratively, in version control.

It's turtles all the way down, but the turtles are in a git repo, which is the only place I trust turtles. The payoff was that the Flux Web UI I described last time — the one that read slightly ahead of the bootstrap step — finally had a coherent origin story. It's operator-managed, not bootstrapped. The two sections in the old post that contradicted each other quietly resolved themselves.

## Where My Own Notes Caught Me

Immich started crashing during thumbnail generation for iPhone video — H.264 and HEVC MOV files from Live Photos. The error was `ffmpeg was killed with signal SIGSEGV`. Classic segfault. Classic hunt.

I blamed `fluent-ffmpeg`. Plausible! The fault surfaced in the Node.js process — the fluent-ffmpeg wrapper — and direct `ffmpeg` commands worked fine when I ran them by hand. The timing even lined up: the crash happened during the cleanup phase, after frames were successfully processed. That *smells* like a wrapper lifecycle bug. I wrote it up, documented the diagnosis, moved on.

I was wrong. The `docs/solutions/` directory caught it months later during a refresh pass.

The actual cause: the Mac Mini is an older Ivy Bridge box — 3rd-gen Intel, HD Graphics 4000 — with no VAAPI, CUDA, or Vulkan support. ffmpeg tries to initialize hardware acceleration during processing. On a CPU that has no accel surface, that initialization fails. And because ffmpeg is a gentleman about it, the fault doesn't surface until *after* it's done the useful work — during cleanup, out of spite.

The reason I was misled: the direct `ffmpeg` commands I tested *implicitly disabled* hardware acceleration, so they worked. The Immich pipeline enabled it, so it crashed. Same binary, different default, opposite conclusion. My test was rigged to confirm my hypothesis.

The fix is one environment variable:

```yaml
env:
  FFMPEG_HWACCEL: "false"   # software-only on Ivy Bridge; the honest mode
  FFMPEG_WORKERS: "1"        # secondary mitigation
```

The lesson isn't "check your CPU's acceleration support before enabling transcoding" — though, yes, obviously, that. Haswell (4th gen) and newer are fine; Ivy Bridge and earlier need software-only. The lesson is that my own solution doc carried the wrong diagnosis for months, and the compounding-docs discipline caught it on a re-read, not at the time of writing. I'd rather have documentation that admits it was wrong than documentation that was never wrong because I never wrote it down.

## Improving Security Posture

Three months ago, CrowdSec was an edge bouncer: blocked bad IPs, sat in front of Traefik, ran its LAPI. Fine. Since then it started ingesting Talos node logs too — cluster-wide acquisition, not just edge traffic — and the scope quietly outgrew a single solution doc. That's why it got its own skill with a reference tree. When the security surface grows, the skill surface follows.

The other thing that happened: I found plaintext credentials in the docs.

Not in the cluster — the cluster uses SOPS/Age, secrets are encrypted, that was always fine. But the *documentation* of how I'd set things up, written back when I was figuring it out, had real tokens in the examples. In the repo. In git history. Which meant I got to spend an afternoon with [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/):

```bash
# the day I made my past disappear, for legal reasons
bfg --replace-text passwords.txt homelab-infra.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

Documentation hygiene as lived practice, not theory: the lesson is that you write the creds down *once* while debugging, and then they live in your history forever until you surgically remove them. Better to redact at write time. I now redact at write time.

## Running My Own Apps

Three months ago the cluster hosted other people's Helm charts — Immich, Plex, Grafana, CrowdSec, Traefik. That's still most of it. But this quarter I started shipping my own images through the same reconciliation loop: a small AI playlist generator for Plex, and a job-search tracker. Both behind Traefik. Both reconciled by Flux like everything else.

The shift is small but real. Hosting off-the-shelf software teaches you operations. Shipping your own images into the same loop teaches you the whole pipeline — build, tag, push, reconcile, break, fix, reconcile again. The cluster doesn't care that the image is mine. It just applies the manifest. Which is, I think, the highest compliment I can pay GitOps: my own software is treated with exactly the same indifference as everyone else's.

## Major Upgrades Under GitOps: Immich v2 → v3

The Immich v2 → v3 upgrade would've been a sweaty afternoon on a manual cluster. Under Flux it was a commit. Something broke; I reverted the commit; it un-broke. I re-tried with a config tweak; it stuck.

One thread tied back to the ffmpeg saga: Immich's `FFMPEG_*` environment variables aren't officially supported, so the `FFMPEG_HWACCEL=false` fix from above is a "works, but don't call us" kind of deal. It survived the v3 upgrade, which I was not confident about and am now.

## What Stalled (the Honest Beat)

The original post had a "What's Next" list. Let me be honest about it:

- **Gitea Actions CI with in-cluster runners** — actually shipped. Quietly. An `act_runner` deployment with DinD, living in the cluster it tests. It builds and pushes the images for the self-hosted apps (the playlist generator, the job-search tracker) through the same reconciliation loop as everything else. The blog itself publishes separately via GitHub Actions.
- **Second node for HA** — not shipped. The Mac Mini hasn't died, so the urgency is theoretical.
- **Better Alertmanager rules** — I'll get to it. Probably. Eventually.

The mature homelab is mostly about what you choose *not* to do. I chose not to do quite a lot this quarter, and the cluster kept running anyway, which is either a win or an indictment of my ambitions.

## What the Next Six Months Look Like

The deferred items above are still the list, reframed as decisions rather than TODOs. Second-node HA is the next one I'll actually pick up — the Mac Mini hasn't earned its keep by failing yet, but the redundancy is the last piece between "homelab" and "homelab I'd show people without caveat."

But the highest-leverage thing I can invest in is the skill layer. Not because skills are glamorous — they're the opposite of glamorous — but because I'm running out of things I personally want to debug twice. Every problem I've solved twice now has a doc. Every doc that got a diagnosis wrong now has a correction. The skill stack means the next agent — or the next me, after a machine swap, or a long pause, or a few beers — starts from the corrected version, not from zero.

Three months in, I thought the cluster was the project. Six months in, the cluster is fine. The `docs/solutions/` directory is the project. The cluster just pays rent.

---

*Starts here: [Building a Homelab with Flux GitOps: Some lessons, three months in](/blog/homelab-flux-gitops-journey). For the AI-assisted side, see [Building a Knowledge Graph with Obsidian and MCP](/blog/knowledge-graph-obsidian-mcp).*