---

## title: Building a Knowledge Graph with Obsidian and MCP

description: How to turn your Obsidian vault into a queryable knowledge graph that AI assistants can navigate, search, and learn from.
date: 2026-04-04T00:00:00.000Z

# Building a Knowledge Graph with Obsidian and MCP

Obsidian vaults are just folders of Markdown files. But when you connect them to an AI assistant through MCP, they become something more: a knowledge graph that your tools can navigate, search, and reason about.

## The Problem: Notes Without Structure

Most people dump notes into Obsidian without thinking about how they'll be used later. The result is a pile of files that's hard to search and impossible for an AI to make sense of.

The community has been clear about this: **Obsidian MCP without structured note types just dumps notes wherever** — no concept of "this is a meeting note vs a project log." The structured approach is what makes the system actually usable.

## Step 1: Define Your Note Types

Before connecting anything to MCP, decide what kinds of notes you'll create. Each type should have its own structure:

- **Meeting notes** — date, attendees, decisions, action items
- **Project logs** — project name, status, blockers, next steps
- **Architecture decisions** — context, options, decision, consequences
- **Ideas** — topic, related notes, status (seeded / developing / archived)

One developer in the community built an Obsidian plugin specifically for this: define note types with documented metadata, folder paths, templates, default values, and required vs optional fields. This schema layer is what separates a knowledge graph from a note graveyard.

## Step 2: Connect via MCP

The connection itself is straightforward. Install the [Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api), enable it, copy the API key from the plugin settings, then add [Markus Pfundstein's mcp-obsidian server](https://github.com/MarkusPfundstein/mcp-obsidian) (the community default for talking to Obsidian over HTTP):

```json
{
  "mcpServers": {
    "mcp-obsidian": {
      "command": "uvx",
      "args": ["mcp-obsidian"],
      "env": {
        "OBSIDIAN_API_KEY": "<your_api_key_here>",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124"
      }
    }
  }
}
```

The MCP client exposes tools to list and search the vault, read files, patch and append content, and delete files. Your vault stays queryable through whatever folder Obsidian has open.

## Step 3: Build the Graph

The real value comes from linking. Obsidian's `[[double bracket]]` syntax creates connections between notes. Over time, these links form a graph — and an assistant connected via MCP can traverse it.

When you ask "What decisions have I made about authentication?", the model doesn't have to stop at the word "authentication." It can follow links from your project notes to architecture decisions to meeting summaries and keep context aligned with how you structured the vault.

## Going Further: Vector Search

For larger vaults, semantic search becomes essential. Some users create a vault vector database with MCP to let AI perform similarity search across their knowledge base. That way assistants can surface relevant notes even when the exact keywords don't match.

The setup: run a local embedding model, index your vault, and expose it through MCP. Now "find notes about my authentication decisions" works even if the notes say "OAuth implementation" or "login flow."

## The Docker MCP Toolkit

If you want to run MCP servers in containers, the Docker MCP toolkit makes it easy. Add an Obsidian server through the catalog, paste your API key, and point any MCP-capable client at the gateway — Cursor, Claude Desktop, OpenCode, LM Studio, or others.

The gateway handles authentication, tool routing, and secret management. You describe the outcome; the client and tools do the rest.

## What This Looks Like in Practice

Here's a typical workflow:

1. **Morning** — The assistant reads my daily note and picks up what I'm working on
2. **During work** — I capture decisions and meeting notes as they happen
3. **End of day** — The assistant summarizes, links related notes, updates project status
4. **Next morning** — Context carries forward in the vault. Less re-explaining in the chat.

The vault becomes an extension of your thinking. Not just a place to store notes, but a knowledge graph that helps you notice patterns you'd miss otherwise.

## Getting Started

If you're starting from scratch:

1. Install Obsidian and the Local REST API plugin
2. Define 3-4 note types with templates
3. Connect via MCP
4. Start writing. Link everything.

Your future self will thank you.

---

*For more on AI-assisted development, see my post on [Ralph Loops](/blog/ralph-loops).*