# AGENTS.md

## Cursor Cloud specific instructions

This is a Nuxt 4 personal portfolio/blog site (`@dmarr/cv`). It is a single application — not a monorepo.

**Design:** Follow `.impeccable.md` for brand, typography, and Nuxt UI semantic-token conventions when changing layout or styling.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (serves at `http://localhost:3000`) — in remote/VM dev sandboxes, file watchers may be unreliable; `nuxt.config` enables chokidar + Vite **polling** when the cwd is `/workspace` (etc.) or `DEV_USE_POLLING=1` is set, so @nuxt/content and `.vue` edits hot-reload without restarting. |
| Build | `pnpm build` |
| Typecheck | `npx nuxi typecheck` |
| Generate types | `npx nuxi prepare` |

### Notes

- **Cursor skills:** Skills such as `/last30days` may appear in Cursor’s skills list and are invoked in the IDE; autonomous cloud agents do not necessarily run them unless you trigger them or wire equivalent tooling.
- **No ESLint or linter** is configured in this project. Typecheck via `npx nuxi typecheck`.
- **No automated tests** exist in this project.
- The project uses **pnpm 9.15.4** (pinned via `packageManager` in `package.json`). Node v22 is required.
- Pre-existing type errors exist in `MorphingText.vue` and `blog/index.vue` — these are known and not regressions.
- The CV/resume rendering (`pnpm cv:render`) requires Python 3 + `rendercv[full]==2.8` but pre-built artifacts (`public/resume.pdf`, `content/resume.md`) are already committed, so this is only needed when editing the CV YAML.
- `@nuxt/content` v3 uses an embedded SQLite database (`better-sqlite3`) — no external database setup is needed.
- No Docker, external APIs, or microservices are required.
