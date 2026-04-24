---
title: A simple publishing platform
description: How I built this site with Nuxt Content and Nuxt UI
date: 2026-01-18T00:00:00.000Z
---

I've been through the cycle of over-engineering personal sites more times than I'd like to admit. This time, I wanted something different: a setup that gets out of the way and lets me focus on writing.

## The stack

With [Nuxt UI](https://ui.nuxt.com) and a Git-based content workflow, I can publish and host my site for free. Here's what powers it:

- **Nuxt 4** – The Vue framework for the modern web
- **Nuxt Content** – File-based CMS with MDC support
- **Nuxt UI** – Beautiful components out of the box

## Why this approach

There's no database to manage, no CMS admin panel to secure, and no monthly hosting bill. Content lives in Markdown files alongside the code. When I push to GitHub, the site rebuilds and deploys automatically.

The real magic is [MDC (Markdown Components)](https://content.nuxt.com/docs/files/markdown#mdc-syntax). It lets me drop Vue components directly into Markdown, which means I can build custom layouts and interactive elements without leaving the content files. The home page project cards? Those are MDC components.

## Editing in the repo

I write in my editor; commits go through Git as usual. Local `pnpm dev` shows the same setup the static site uses after CI builds.

## Keeping it simple

The entire source is available on [GitHub](https://github.com/marr/marr.github.io). There's no build configuration to speak of—Nuxt handles that. No complex deployment pipelines—GitHub Pages serves the static output. The result is a site that's fast to load, easy to maintain, and costs nothing to run.
