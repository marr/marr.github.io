---
title: A simple publishing platform
description: How I built this site with Nuxt Studio and Nuxt UI
date: 2026-01-18
---

I've been through the cycle of over-engineering personal sites more times than I'd like to admit. This time, I wanted something different: a setup that gets out of the way and lets me focus on writing.

## The stack

With [Nuxt Studio](https://nuxt.studio) and [Nuxt UI](https://ui.nuxt.com), I can publish and host my site for free. Here's what powers it:

- **Nuxt 4** – The Vue framework for the modern web
- **Nuxt Content** – File-based CMS with MDC support
- **Nuxt UI** – Beautiful components out of the box
- **Nuxt Studio** – Visual editing and Git-based publishing

## Why this approach

There's no database to manage, no CMS admin panel to secure, and no monthly hosting bill. Content lives in Markdown files alongside the code. When I push to GitHub, the site rebuilds and deploys automatically.

The real magic is [MDC (Markdown Components)](https://content.nuxt.com/docs/files/markdown#mdc-syntax). It lets me drop Vue components directly into Markdown, which means I can build custom layouts and interactive elements without leaving the content files. The home page project cards? Those are MDC components.

## Nuxt Studio for editing

While I typically write in my editor, Nuxt Studio provides a visual interface for content editing. It connects directly to the Git repository, so changes still go through version control. This is useful for quick edits or when I want to preview changes before committing.

## Keeping it simple

The entire source is available on [GitHub](https://github.com/marr/marr.github.io). There's no build configuration to speak of—Nuxt handles that. No complex deployment pipelines—GitHub Pages serves the static output. The result is a site that's fast to load, easy to maintain, and costs nothing to run.
