---
title: Exploring Obsidian as an MCP server
description: Notes on wiring a personal knowledge base into AI tools through the Model Context Protocol.
date: 2026-04-04T00:00:00.000Z
---

I've been thinking about how to bring my [Obsidian](https://obsidian.md) vault closer to the agents and editors I already use. The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is the obvious hook: a standard way for a client to discover **tools**, **resources**, and **prompts** from a server, instead of one-off integrations for every product pair.

This post is a working draft—more of a map of what I want to try than a finished conclusion.

## Investigation: `/last30days` and what turned up

The [`/last30days` skill](https://github.com/mvanhorn/last30days-skill) (e.g. in Claude Code: `plugin install last30days@last30days-skill`) is built for **recency-first research**: it pulls from Reddit, X, Hacker News, YouTube, optional Polymarket, and web search, then synthesizes with citations. I do not have that skill wired into this repo’s agent session, so this section is a **manual analogue**—a focused web pass on “Obsidian + MCP” from roughly the **last 30 days** of posts and releases, not a scored multi-source brief.

**Themes that keep showing up:**

- **File-first servers** – Several implementations talk to the vault as Markdown on disk (search, read/write, tags, links, sometimes graph or canvas). The pitch is the same: MCP in Claude Desktop, **Cursor**, or similar without a bespoke Obsidian plugin for every client—though some write-ups still pair with Obsidian’s **Local REST API** or other bridges depending on the stack.
- **“Feature-complete” npm projects** – [obsidian-mcp-pro](https://www.npmjs.com/package/obsidian-mcp-pro) and write-ups such as [this Dev.to walkthrough](https://dev.to/rps321321/i-built-the-most-feature-complete-mcp-server-for-obsidian-heres-how-o0k) describe deep tool sets (search, graph-style traversal, canvas, validation). Worth treating as **candidates to evaluate**, not endorsements, until you’ve read the code and threat model.
- **Tutorial wave (March 2026)** – A cluster of practical guides appeared around the same time, e.g. [Joe François on Medium](https://medium.com/@joemugen/supercharging-obsidian-with-ai-using-mcp-319679a36c97), [Gagandeep Bhatia on Medium](https://medium.com/@gagandeep023/build-an-mcp-server-that-connects-claude-directly-to-your-obsidian-vault-d3ced0f67e98), [BSWEN’s Claude + vault integration](https://docs.bswen.com/blog/2026-03-17-mcp-server-obsidian-claude), and [Web Moves on connecting Obsidian to Claude](https://www.webmoves.net/2026/03/15/teaching-ai-to-read-my-second-brain-connecting-obsidian-to-claude/). Useful for setup patterns; still verify versions and security against your own vault.

**Takeaway for this draft:** the space is **active** and **fragmented**—multiple servers, overlapping goals, different trust assumptions. Running the real `/last30days` prompt on *“Obsidian MCP server”* or *“vault MCP Cursor”* in an environment where the skill is installed should surface community threads and gripes the web-only pass misses.

## Why Obsidian and MCP together

Obsidian stores notes as Markdown files on disk. That is a good fit for MCP: you can expose read and write operations, search, and (depending on the server) graph or metadata features without inventing a new API for each assistant. The vault stays **yours**—plain files, version control friendly, and portable.

What I want to validate is whether an MCP server can feel **safe and predictable** for day-to-day use: clear boundaries on what the model can read or change, and behavior that matches how I already organize notes.

## What I plan to explore

- **Which server (or servers)** – There are community and third-party MCP servers aimed at Obsidian-style vaults. I want to compare scope: read-only vs read/write, global search, frontmatter handling, and how they deal with paths and permissions.
- **Client wiring** – How the same MCP server behaves in different hosts (IDEs, terminals, dedicated chat clients) and what friction shows up in configuration and secrets.
- **Trust model** – A vault often mixes rough drafts, personal data, and work notes. I need a clear story for what gets exposed to a model session and whether I can segment by folder or vault.
- **Workflow** – Does "agent + vault" actually speed up linking ideas, maintaining MOCs (maps of content), or cleaning up tags—or does it add noise? I'll only know by trying it on real notes.

## Open questions

- How much of Obsidian's **plugin ecosystem** matters if MCP talks to files directly? (Core linking and search might be enough for many tasks.)
- **Performance** on large vaults: indexing, search latency, and whether the server keeps up with rapid edits.
- **Sync** – If the vault syncs across machines (Obsidian Sync, Git, iCloud, etc.), are there races or conflicts when an agent writes while I'm editing elsewhere?

## Next steps

I'll pick a server, run it locally against a **copy** of a non-sensitive vault, and document the setup and first impressions in a follow-up. If you've already wired Obsidian to MCP and have opinions on servers or guardrails, I'd love to hear them.

---

*Draft — I'll revise this as I try things.*
