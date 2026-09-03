# De' Lead Web — monorepo context

This folder is the consolidated rebuild of the whole De' Lead web estate: one repo,
one Supabase Postgres backend, one admin dashboard, and the marketing front-ends.
It **supersedes** the standalone static sites in the sibling folders (`../De Lead
International/`, `../Walk2Lead/`, `../MakerChamps/`, `../Corporate Training/`,
`../DLI Education/`, `../Tinkerchamps/`) — those are left intact only as reference
and fallback hosting. Do work here, not there.

Full spec: [`docs/PLAN.md`](docs/PLAN.md). Deploy runbook: [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Layout

| Path | What |
|---|---|
| `apps/deleadint` `walk2lead` `makerchamps` `corporate` `dli-education` | Astro 5 **static** marketing sites. Tailwind v4 restyle, each keeps its own accent + display font (`@delead/brand`). Content read from Postgres **at build time** in `.astro` frontmatter (`src/lib/content.ts`). Shared `<LeadForm>` posts to the dashboard's `/api/lead`. |
| `apps/tinkerchamps` | Next 16 app. Migrated off Sanity — `sanity/lib/client.ts` is a shim to `/api/tc/*` routes on Postgres. (Astro conversion under discussion, not yet done.) |
| `apps/dashboard` | Next 15 admin (`admin.deleadint.com`). Auth.js email+password, RBAC (`super_admin` + per-vertical `view`/`edit` grants), generic resource CRUD (`lib/resources.ts` registry), leads inbox, users, audit. |
| `packages/db` | Drizzle schema + client + migrations + seed. **The one source of DB truth.** |
| `packages/ui` | Shared Astro components (`SiteHeader`, `SiteFooter`, `LeadForm`, …) + `client/` scroll utils + `lib/`. |
| `packages/brand` | Tailwind v4 theme tokens, per-vertical palette + font map, the `verticals.ts` registry. |
| `packages/config` | Shared tsconfig / prettier. |

## Rules

- **Secrets** live only in `.env` (gitignored). Never hardcode. `.env.example` documents the keys.
- **Supabase**: project `dslvxzcqcuqhfqqaohfb` (Mumbai). Talk to Postgres via Drizzle over the
  pooler connection string — no Supabase Auth / RLS, so a move to a self-hosted Postgres is an
  env change. Storage goes through `apps/dashboard/lib/storage.ts` (Supabase now, R2-ready).
- **DB changes**: edit `packages/db/src/schema.ts`, then `pnpm --filter @delead/db generate`
  (migration) **and** `pnpm --filter @delead/db schema` (refresh `packages/db/schema.sql`), then
  `pnpm --filter @delead/db migrate`. Commit all three. See `packages/db/CLAUDE.md`.
- **Marketing animation budget**: CSS + one IntersectionObserver + Astro View Transitions only.
  No Lenis / GSAP ScrollTrigger pinning (jitter). Everything respects `prefers-reduced-motion`.
- **Subdomains**: `w2l` `mc` `tc` `corporate` `edu` `admin` on `deleadint.com`
  (`walk2lead`/`makerchamps`/`tinkerchamps` 301 → short forms).
- **DNS is Hostinger, mail is Zoho** (a Cloudflare-DNS migration is planned — see `docs/DEPLOY.md`).
  Never touch `MX` or mail `TXT`/`CNAME` (SPF/DKIM/DMARC) records.
- Dev ports: dashboard 3100, tinkerchamps 3200, deleadint 4321, walk2lead 4322, makerchamps 4323,
  corporate 4324, dli-education 4325. `pnpm dev` runs all; or `pnpm --filter <name> dev`.
- Seeded admin: `webdelead@gmail.com` (change the password on first real login).
