# AGENTS.md

## Cursor Cloud specific instructions

This is a Nuxt 4 personal portfolio/blog site (`@dmarr/cv`). It is a single application — not a monorepo.

### Quick reference

| Action | Command |
|--------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (serves at `http://localhost:3000`) |
| Build | `pnpm build` |
| Typecheck | `npx nuxi typecheck` |
| Generate types | `npx nuxi prepare` |

### Notes

- **No ESLint or linter** is configured in this project. Typecheck via `npx nuxi typecheck`.
- **No automated tests** exist in this project.
- The project uses **pnpm 9.15.4** (pinned via `packageManager` in `package.json`). Node v22 is required.
- Pre-existing type errors exist in `MorphingText.vue` and `blog/index.vue` — these are known and not regressions.
- The CV/resume rendering (`pnpm cv:render`) requires Python 3 + `rendercv[full]==2.8` but pre-built artifacts (`public/resume.pdf`, `content/resume.md`) are already committed, so this is only needed when editing the CV YAML.
- `@nuxt/content` v3 uses an embedded SQLite database (`better-sqlite3`) — no external database setup is needed.
- No Docker, external APIs, or microservices are required.
