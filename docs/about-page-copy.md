# About page copy (plain-language pass)

Editorial review doc for `/about`. Source of truth in the app is `app/utils/aboutContent.ts`.

## Intro

**Headline:** Engineering leadership, 25 years of shipping software

**Lede:** Twenty-five years building production software—from industrial dashboards and Webby-recognized consumer sites to teams using AI in day-to-day delivery. I lead engineering orgs that ship reliable products, keep infrastructure under their own control, and care about UI polish—not just automation.

## Three pillars

### Scalable architecture
Multi-tenant SaaS—including decarbonization-as-a-Service (DaaS) at Context Labs—plus backend-for-frontend APIs and clear engineering standards. Cut incident recovery time 50% through goals, code review, and AI coding tools.

### AI with taste
Interfaces that feel responsive and considered. AI should shorten the path from idea to working software, not replace thoughtful product work.

### Breadth across stacks
Industrial automation, payment products at £2m/month, and AI-powered hiring tools—enough range to guide teams through stack changes without breaking what already works.

## Timeline (four phases)

1. **2000–2008 — Industrial and enterprise foundations** — Dashboards for GE Fanuc/Intellution, enterprise integrations at SoftArtisans, Webby-recognized work at Monster.com.

2. **2009–2015 — Consumer scale and design** — MagicBand at Frog, Yahoo frontend architecture, 15% signup lift at Tilt with early React server rendering.

3. **2016–2022 — SaaS and product leadership** — £2m/month payment products at OneMarket, host tools at Turo, AI hiring at Filtered.ai.

4. **2022–2026 — AI leadership and design teams** — Engineering manager at Context Labs on a decarbonization-as-a-Service (DaaS) platform; 50% faster incident recovery; AI coding tools with review standards.

## Staples

| Tool | Why |
|------|-----|
| React | Default for product UIs—Vue and Nuxt when SSR, file routing, or this site’s stack fit better |
| Vega Lite | Charts from concise specs |
| Markdown & OKF | Markdown for readable docs; Google's Open Knowledge Format for structured, agent-friendly knowledge (YAML frontmatter, one concept per file) |
| shadcn/ui | Accessible Radix + Tailwind components |
| Obsidian | Local Markdown notes |

## Workbench

- **Infrastructure:** Talos, Gitea — self-hosted, less vendor lock-in
- **Web tooling:** TanStack Start, Vite+ — faster builds
- **AI tooling:** pi-mono, shaders.com — CLI-first workflows

## Closing

I combine solid engineering practice with AI-assisted delivery—helping teams move faster while keeping reliability and good design. Self-hosted infrastructure, thoughtful interfaces, and production habits that survive stack changes.

## Jargon removed (reference)

| Before | After |
|--------|-------|
| high-agency interfaces | responsive, considered interfaces |
| sovereign infrastructure | self-hosted / under your own control |
| MTTR | incident recovery time |
| BFF patterns | backend-for-frontend APIs |
| UI/UX orchestration | design and frontend teams |
| agentic workflow | AI-driven development |
| inspectable proof of shipping | open source you can read |
| technical competency | what I work with |
