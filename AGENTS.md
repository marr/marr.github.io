# AGENTS.md

## Cursor Cloud specific instructions

This is a Nuxt 4 personal portfolio/blog site (`@dmarr/cv`). It is a single application — not a monorepo.

**Design:** Follow `.impeccable.md` for brand, typography, and Nuxt UI semantic-token conventions when changing layout or styling.

### Quick reference

- **Install deps:** `pnpm install`
- **Dev server:** `pnpm dev` (serves at `http://localhost:3000`)
- **Build:** `pnpm build`
- **Typecheck:** `npx nuxi typecheck`
- **Generate types:** `npx nuxi prepare`

### Slack communication

When replying in Slack (including Cloud Agent updates mirrored to a channel), **do not use pipe-style markdown tables** (`| col | col |`). Slack mrkdwn renders them as plain text with literal pipes.

For tabular data in Slack, use one of:

1. **Structured bullets** — bold row labels, values inline (best for 2–4 columns).
2. **Monospace code block** — ASCII-aligned columns inside a fenced block (best for wider grids).
3. **GitHub / site links** — point to content where GFM tables render (blog posts, PRs).

Blog and resume markdown tables on the site are fine; this rule applies only to Slack-delivered agent text.

### Notes

- **Content routes:** `app/pages/[...slug].vue` and `blog/[...slug].vue` use `useContentPath()` so the index route always queries path `"/"` in `@nuxt/content` (router can surface `""`).
- **Cursor skills:** Skills such as `/last30days` may appear in Cursor’s skills list and are invoked in the IDE; autonomous cloud agents do not necessarily run them unless you trigger them or wire equivalent tooling.
- **No ESLint or linter** is configured in this project. Typecheck via `npx nuxi typecheck`.
- **No automated tests** exist in this project.
- The project uses **pnpm 9.15.4** (pinned via `packageManager` in `package.json`). Node v22 is required.
- Pre-existing type errors exist in `MorphingText.vue` and `blog/index.vue` — these are known and not regressions.
- The CV/resume rendering (`pnpm cv:render`) requires Python 3 + `rendercv[full]==2.8` but pre-built artifacts (`public/resume.pdf`, `content/resume.md`) are already committed, so this is only needed when editing the CV YAML.
- `@nuxt/content` v3 uses an embedded SQLite database (`better-sqlite3`) — no external database setup is needed.
- No Docker, external APIs, or microservices are required.
