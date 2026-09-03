# De' Lead Web

Monorepo for the De' Lead International web estate: six marketing front-ends, one
admin dashboard, one Supabase Postgres backend. **Next.js everywhere**, pnpm
workspaces + Turbo, Node 24.

| App | Stack | URL |
|---|---|---|
| `apps/deleadint` | Next 15 (App Router, ISR) | deleadint.com |
| `apps/walk2lead` | Next 15 (App Router, ISR) | w2l.deleadint.com |
| `apps/makerchamps` | Next 15 (App Router, ISR) | mc.deleadint.com |
| `apps/corporate` | Next 15 (App Router, ISR) | corporate.deleadint.com |
| `apps/dli-education` | Next 15 (App Router, ISR) | edu.deleadint.com |
| `apps/tinkerchamps` | Next 16 (App Router, ISR) | tc.deleadint.com |
| `apps/dashboard` | Next 15 (admin) | admin.deleadint.com |

The five marketing sites were converted Astro → Next in 2026-09 as 1:1 pixel
ports (verbatim `styles.css`/`main.js`, componentised markup). ISR:
`revalidate = 3600` + a shared `/api/revalidate` (`@delead/shared`
`makeRevalidateRoute`), triggered by the dashboard's "Publish" button.

Shared packages: `packages/db` (Drizzle + Postgres — the source of DB truth),
`packages/shared` (`assetPublicUrl` / `snakeToCamel` / `verifyTurnstile` /
`makeRevalidateRoute`), `packages/brand` (theme tokens + `verticals.ts`),
`packages/config` (tsconfig / prettier).

## Setup

```bash
pnpm install
cp .env.example .env      # fill in — see docs/DEPLOY.md
pnpm --filter @delead/db generate
pnpm --filter @delead/db migrate
pnpm --filter @delead/db seed
pnpm dev                  # all apps; or  pnpm --filter <name> dev
```

Before committing: `pnpm typecheck` and `pnpm --filter @delead/dashboard test`.

See [`CLAUDE.md`](CLAUDE.md) for conventions, [`docs/DEPLOY.md`](docs/DEPLOY.md)
for the deploy runbook, and [`docs/MANUAL-CHECKLIST.md`](docs/MANUAL-CHECKLIST.md)
for outstanding console / infra steps.

First deploy is driven by [`docs/DEPLOY-CHROME-PROMPT.md`](docs/DEPLOY-CHROME-PROMPT.md).
