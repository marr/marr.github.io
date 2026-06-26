---
title: "refactor: Consolidate About into home (Option A)"
date: 2026-06-26
type: refactor
origin: docs/plans/2026-06-25-001-feat-about-page-homepage-updates-plan.md
---

# refactor: Consolidate About into home (Option A)

## Summary

Merge the About page’s unique narrative content (lede, pillars, career timeline) into the home page as MDC sections, remove `/about` and duplicated project/stack listings, and add a redirect for old links. The RenderCV résumé pipeline (`pnpm cv:render`, `pnpm build`, CI PDF step, `/resume`) stays untouched.

## Problem Frame

Home and About overlap heavily: the same open-source repos, staples/exploring tools, and AI & taste links appear on both pages; About also repeats career narrative that already lives on `/resume`. Visitors scan two intro surfaces; maintainers edit two catalogs. Option A (single landing page) keeps home as the canonical proof-of-work page and sends credential depth to the résumé.

## Requirements

### Consolidated home experience

- R1. Home renders an extended hero block: existing name, roles, avatar, socials, plus the About executive lede paragraph.
- R2. Home renders three pillar cards (scalable architecture, AI with taste, breadth across stacks) immediately after the hero lede.
- R3. Home renders a `UTimeline` career section (four eras from `aboutContent.ts`) using **UTimeline only** — no infographics on home.
- R4. Home project grids (`Open source`, `Staples`, `Exploring`, `Archive`) and `::ai-skills-section` remain the **only** link catalogs; no duplicate OSS/workbench/staples/taste/skills blocks from About.
- R5. Section order on home: hero → pillars → career timeline → project grids → AI & taste.

### About removal and routing

- R6. `/about` returns a permanent redirect to `/` (prefer anchor `#career` when supported).
- R7. Site header nav removes the About item; nav is Home · Résumé · Blog.
- R8. Delete About-only route, page component, and content collection entry (`content/about.md`).

### Résumé build pipeline (non-regression)

- R9. `scripts/render-cv.sh`, `cv/david_marr_rendercv.yaml`, `scripts/harmonize_resume_headings.py`, and `requirements-cv.txt` are **not modified** by this refactor.
- R10. `package.json` scripts `cv:render`, `build`, and `generate` continue to run `render-cv.sh` before Nuxt build/generate.
- R11. `.github/workflows/studio.yml` continues to install Python deps and run `bash scripts/render-cv.sh` before `nuxi build`.
- R12. `/resume` route, `app/pages/resume.vue`, and generated `content/resume.md` / PDF artifacts behave as before (no content or routing changes to the résumé page).

### Content hygiene

- R13. Slim narrative data module retains only lede, pillars, and timeline exports; remove OSS, staples, workbench, taste, skills, site-repo, infographic, and journey-caption exports that duplicated home or résumé.
- R14. Remove unused About assets (`public/about-journey.webp`, `public/about-timeline.webp`) and dead About components.

---

## Key Technical Decisions

- **KTD1: MDC blocks on home, not a bespoke page** — Follow the existing `::home-hero` / `::project-grid` pattern in `content/index.md`. New blocks (`::home-story`, `::career-timeline`) live under `app/components/content/` and are global via the existing `components:extend` hook. Keeps home editable in Markdown and avoids a second Vue page shell.

- **KTD2: Slim TypeScript module for narrative only** — Rename `app/utils/aboutContent.ts` → `app/utils/homeStoryContent.ts` (or equivalent) exporting `executiveSummary`, `pillars`, and `careerTimelineItems` only. Project links stay exclusively in `content/index.md`; employment detail stays in `cv/david_marr_rendercv.yaml` → `content/resume.md`.

- **KTD3: UTimeline only (no infographics)** — User chose timeline-only presentation. Drop both WebP infographics and all figcaption/skill-grid/journey-section data tied to them. Reduces maintenance (NotebookLM typo captions) and page weight.

- **KTD4: `/about` → `/` redirect via `routeRules`** — Add a Nitro redirect in `nuxt.config.ts` rather than keeping a stub page. Preserves inbound links and search indexing without maintaining duplicate content.

- **KTD5: Zero touch on résumé pipeline files** — Consolidation is limited to home content, About removal, header nav, and narrative utils. Implementer must not edit CV YAML, render script, harmonizer, resume page, or CI render step as part of this work; verification unit explicitly re-runs `pnpm cv:render` and `pnpm build` to prove non-regression.

---

## High-Level Technical Design

```mermaid
flowchart TB
  subgraph home["Home (content/index.md)"]
    H[home-hero]
    S[home-story: lede + pillars]
    T[career-timeline: UTimeline]
    G[project-grid x4]
    A[ai-skills-section]
    H --> S --> T --> G --> A
  end

  subgraph data["Data sources"]
    MDC[content/index.md]
    STORY[homeStoryContent.ts]
    CV[cv/david_marr_rendercv.yaml]
  end

  MDC --> H
  MDC --> G
  MDC --> A
  STORY --> S
  STORY --> T
  CV -->|render-cv.sh| RESUME[/resume unchanged]

  ABOUT_OLD[/about] -->|301| home
```

---

## Scope Boundaries

### Out of scope

- Rewriting résumé copy or CV YAML.
- Adding skill badge grids to home (résumé + timeline cover credentials).
- Re-exporting or fixing infographic PNG/WebP assets.
- Blog, header styling beyond removing About nav item.

### Deferred to Follow-Up Work

- Optional `#career` skip link in hero or compact “Read résumé” CTA below timeline (only if home feels long after ship).
- Updating `docs/about-page-copy.md` into a home-narrative editorial doc (delete if redundant).

---

## Risks & Dependencies

- **Pre-existing type errors** in `MorphingText.vue` and `blog/index.vue` — known; not regressions; do not expand scope to fix.
- **Inbound `/about` links** — mitigated by R6 redirect.
- **Accidental résumé pipeline edit** — highest user-stated risk; mitigated by R9–R12 and explicit verification in U5.
- **Home page length** — timeline + four project grids is a long scroll; acceptable trade-off for single landing page; monitor after ship.

---

## Implementation Units

### U1. Home story MDC block (lede + pillars)

**Goal:** Surface About’s executive summary and pillar cards on home via Markdown.

**Requirements:** R1, R2, R5

**Dependencies:** None

**Files:**
- `app/components/content/HomeStorySection.vue` (create)
- `app/utils/homeStoryContent.ts` (create from slimmed `aboutContent.ts`)
- `content/index.md` (modify — insert `::home-story` after `::home-hero`)

**Approach:** Vue section reads `executiveSummary.lede` and `executiveSummary.pillars` from the slim module. Match About pillar card styling (border, `bg-elevated/30`, three-column grid on `md+`). Props optional for MDC frontmatter overrides; default to module exports.

**Patterns to follow:** `app/components/content/AiSkillsSection.vue` (section header + border-l accent); About pillar markup from `AboutPageContent.vue`.

**Test scenarios:**
- Home loads with lede paragraph visible below morphing roles and above project grids.
- Three pillar titles render with body copy; layout stacks on mobile, three columns on desktop.
- Hero social links and avatar unchanged.

**Verification:** Dev server `/` — visual check; no console errors.

---

### U2. Career timeline MDC block

**Goal:** Add `UTimeline` career eras to home (timeline-only, no images).

**Requirements:** R3, R5

**Dependencies:** U1 (shared `homeStoryContent.ts`)

**Files:**
- `app/components/content/CareerTimelineSection.vue` (create)
- `app/utils/homeStoryContent.ts` (export `careerTimelineItems`)
- `content/index.md` (insert `::career-timeline` after `::home-story`, before first `::project-grid`)

**Approach:** Section `id="career"` for redirect anchor. Reuse About timeline config: `color="primary"`, `default-value` on latest era, `:ui="{ description: 'text-pretty max-w-prose' }"`. Section header matches other home blocks (border-l, uppercase kicker).

**Patterns to follow:** `UTimeline` usage in `AboutPageContent.vue`.

**Test scenarios:**
- Four timeline items render with date, title, narrative, and icons.
- Latest era appears active/highlighted per Nuxt UI defaults.
- `#career` anchor scrolls to timeline when navigated directly.

**Verification:** Dev server `/` and `/#career` — timeline visible, anchor works.

---

### U3. Remove About route and duplicated content

**Goal:** Delete About page surface and slim the data module.

**Requirements:** R4, R8, R13, R14

**Dependencies:** U1, U2

**Files:**
- `app/pages/about.vue` (delete)
- `app/components/about/AboutPageContent.vue` (delete)
- `content/about.md` (delete)
- `app/utils/aboutContent.ts` (delete after migration to `homeStoryContent.ts`)
- `public/about-journey.webp` (delete)
- `public/about-timeline.webp` (delete)
- `docs/about-page-copy.md` (delete or archive — prefer delete unless editorial value)

**Approach:** Grep for `aboutContent`, `AboutPageContent`, `/about` imports and remove stragglers. Ensure no references to deleted exports (`openSourceProjects`, `staples`, `tasteLinks`, etc.) remain.

**Test scenarios:**
- Grep finds zero imports of deleted About module paths.
- Home still renders all four project grids and AI & taste with same card count as pre-refactor.

**Verification:** `rg 'aboutContent|AboutPageContent|/about'` returns only redirect config and plan docs.

---

### U4. Navigation and `/about` redirect

**Goal:** Update nav and preserve old URLs.

**Requirements:** R6, R7

**Dependencies:** U3

**Files:**
- `app/components/SiteHeader.vue` (remove About nav item)
- `nuxt.config.ts` (add `routeRules` redirect for `/about`)

**Approach:** Redirect `{ from: '/about', to: '/#career', redirect: { statusCode: 301 } }` (or `/` if hash redirect proves unreliable in static GitHub Pages preset — implementer validates in preview).

**Test scenarios:**
- Header shows Home, Résumé, Blog only.
- Request to `/about` resolves to home (with career anchor when supported).

**Verification:** Manual nav click test; curl or browser check of redirect status.

---

### U5. Résumé pipeline verification (non-regression gate)

**Goal:** Prove consolidation did not break CV render, build, or résumé page.

**Requirements:** R9, R10, R11, R12

**Dependencies:** U1–U4 complete

**Files:** None modified — verification only.

**Approach:** Run the same commands CI runs, in order:
1. `pnpm cv:render` — regenerates `content/resume.md` and PDFs from YAML.
2. `pnpm build` — render script + Nuxt build.
3. `npx nuxi typecheck` — no new errors beyond known baseline.

Confirm `/resume` still serves harmonized markdown with PDF link and experience sections.

**Test scenarios:**
- `pnpm cv:render` exits 0; `content/resume.md` retains generated banner comment and frontmatter.
- `public/david-marr-resume.pdf` and `public/resume-ats.pdf` exist after render.
- `pnpm build` exits 0.
- `/resume` loads in dev with experience headings and PDF link.

**Verification:** All three commands pass; git diff on `content/resume.md` is empty or only timestamp-free content if YAML unchanged (no accidental hand-edits to generated file).

---

## Sources & Research

- Prior overlap analysis and Option A recommendation (conversation 2026-06-26).
- Shipped About implementation: `docs/plans/2026-06-25-001-feat-about-page-homepage-updates-plan.md` (superseded by this plan for IA direction).
- Homepage IA: `.impeccable.md` — project grids as canonical catalogs; AI & taste as link list.
- Résumé pipeline: `package.json` scripts, `scripts/render-cv.sh`, `.github/workflows/studio.yml` RenderCV step, `AGENTS.md` CV notes.
- MDC pattern: `content/index.md`, `nuxt.config.ts` global content components hook.
