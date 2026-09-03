# De' Lead Web

Monorepo for the De' Lead International web estate: six marketing front-ends, one
admin dashboard, one Supabase Postgres backend.

| App | Stack | URL |
|---|---|---|
| `apps/deleadint` | Astro (static) | deleadint.com |
| `apps/walk2lead` | Astro (static) | w2l.deleadint.com |
| `apps/makerchamps` | Astro (static) | mc.deleadint.com |
| `apps/corporate` | Astro (static) | corporate.deleadint.com |
| `apps/dli-education` | Astro (static) | edu.deleadint.com |
| `apps/tinkerchamps` | Next.js | tc.deleadint.com |
| `apps/dashboard` | Next.js | admin.deleadint.com |

Shared: `packages/db` (Drizzle + Postgres), `packages/ui`, `packages/brand`, `packages/config`.

## Setup

```bash
pnpm install
cp .env.example .env      # fill in — see docs/PLAN.md
pnpm --filter @delead/db generate
pnpm --filter @delead/db migrate
pnpm --filter @delead/db seed
pnpm dev
```

See [`docs/PLAN.md`](docs/PLAN.md) for the full spec (schema, RBAC, dashboard IA, hosting).
