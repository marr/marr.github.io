---
title: "feat: About page and homepage polish"
date: 2026-06-25
type: feat
execution: code
---

# feat: About page and homepage polish

## Summary

Add an About page with career narrative, infographics, and timeline; polish the homepage project grids (Vite+ branding, OCLP archived); wire site navigation to the new route.

## Problem Frame

The portfolio lacked a dedicated About page for the 25-year career story. The homepage still showed outdated Vite branding and listed OpenCore Legacy Patcher under Exploring instead of Archive.

## Requirements

- **R1.** `/about` renders a structured About page with intro, pillars, infographics (with corrected captions for image typos), UTimeline career eras, staples table, workbench, OSS cards, skills, and site repo link.
- **R2.** Site header includes an About nav item linking to `/about`.
- **R3.** Homepage Vite+ card uses the official Vite+ favicon SVG, not the legacy Vite.js icon.
- **R4.** OpenCore Legacy Patcher moves from Exploring to Archive on the homepage.
- **R5.** `ProjectCard` supports colored logo images via optional `imageInvert: false` without breaking monochrome SVG logos (default invert behavior preserved).

## Key Technical Decisions

- **KTD1: Content in TypeScript module** — Copy and structured data live in `app/utils/aboutContent.ts`; `content/about.md` carries SEO frontmatter only. Matches existing content-route patterns and keeps long copy out of MDC.
- **KTD2: Vite+ square favicon for cards** — Use `public/vite-plus-favicon.svg` in the `size-5` icon slot rather than the horizontal wordmark.
- **KTD3: imageInvert prop** — Default `true` preserves pi-mono and similar white SVG behavior; Vite+ sets `imageInvert: false`.

## Implementation Units

### U1. About page route and content

**Goal:** Ship `/about` with full page layout and assets.

**Requirements:** R1, R2

**Files:**
- `app/pages/about.vue`
- `app/components/about/AboutPageContent.vue`
- `app/utils/aboutContent.ts`
- `content/about.md`
- `public/about-journey.webp`
- `public/about-timeline.webp`
- `app/components/SiteHeader.vue`

**Approach:** Thin page wrapper loads content metadata; `AboutPageContent.vue` composes sections using Nuxt UI (`UTimeline`, badges, cards). Infographic typos corrected in HTML figcaptions below images.

**Test scenarios:**
- Navigate to `/about` — page loads with title, pillars, both infographics, timeline, and closing CTA.
- About link appears in header and routes correctly.

**Verification:** Dev server renders `/about` without console errors; header nav includes About.

### U2. Homepage project grid updates

**Goal:** Update Exploring/Archive cards and Vite+ branding.

**Requirements:** R3, R4

**Files:**
- `content/index.md`
- `public/vite-plus-favicon.svg`
- `public/vite-plus-logo.svg`
- `public/vite-plus-logo-dark.svg`

**Approach:** Replace Vite+ `icon` with `image` + `imageInvert: false`; move OCLP card block from Exploring to Archive.

**Test scenarios:**
- Homepage Exploring section no longer lists OpenCore Legacy Patcher.
- Archive section includes OpenCore Legacy Patcher.
- Vite+ card shows purple bolt favicon in light and dark mode.

**Verification:** Visual check on homepage project grids.

### U3. ProjectCard imageInvert support

**Goal:** Allow full-color logos on project cards.

**Requirements:** R5

**Files:**
- `app/components/content/ProjectCard.vue`

**Approach:** Add optional boolean prop; conditionally apply invert classes on `<img>`.

**Test scenarios:**
- pi-mono card still inverts correctly in light mode (default).
- Vite+ card does not invert.

**Verification:** Inspect both cards on homepage.

## Scope Boundaries

### Out of scope

- Re-exporting infographic PNGs with pixel-level typo fixes (captions carry corrections).
- Committing `docs/about-page-copy.md` unless explicitly useful as repo documentation.

### Deferred to Follow-Up Work

- Blog posts for cocktail recipes and Peloton exploration (removed from homepage earlier).

## Risks & Dependencies

- Pre-existing type errors in `MorphingText.vue` and `blog/index.vue` are known; not regressions.
- `@nuxt/ui` bump to 4.9.0 is incidental lockfile refresh; verify build passes.
