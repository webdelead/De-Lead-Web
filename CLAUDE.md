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
| `apps/deleadint` `walk2lead` `makerchamps` `corporate` `dli-education` | **Next 15 App Router** marketing sites (converted from Astro 2026-09). Each is a **1:1 pixel port** of its client-approved static design — the original `css/styles.css` + `js/main.js` are copied **verbatim** into `public/`, only the markup is componentised (`components/S01_*`…`SNN_*`, split mechanically by `scripts/html2jsx.mjs`). Dynamic sections are async server components reading Postgres via `lib/content.ts` (deleadint: press/voices/journal · walk2lead: projects/testimonials/gallery/press · makerchamps: gallery/testimonials · corporate: track record/testimonials/gallery · dli-education: student catalogue + outcomes on `/students`); everything else is static JSX. Content is seeded byte-identical to the markup via `packages/db/scripts/populate.ts`. `export const revalidate = 3600` + `app/api/revalidate` (POST, `x-revalidate-secret`) for on-demand ISR. `output: "standalone"`, images from Supabase Storage. Custom `not-found.tsx` per app. Lead `<form data-lead-source>` picked up by `public/js/lead-capture.js` → dashboard `/api/lead`. **Never change the visible design** — verify any edit against the sibling static folder. |
| `apps/tinkerchamps` | Next 16 app, **same ISR model as the 5 marketing sites** (2026-09): `(site)/page.tsx` is an async server component that fetches events/gallery/reviews from Postgres (`app/lib/tc-db.ts`) and passes them as props; `revalidate = 3600` + `app/api/revalidate`. ScrollColorBackground + Lenis + WebGL gallery + framer-motion all kept (client components, unaffected). The old Sanity shim + `/api/tc/*` routes were deleted. Journey section is static cards; booking modal is a single 5-field labelled form → `/api/booking` → `tc_bookings` (still dynamic — it's a write). |
| `apps/dashboard` | Next 15 admin (`admin.deleadint.com`). **Supabase Auth** email+password (login has show/hide + forgot/reset; `lib/supabase/*` + `lib/authz.ts`); `users` table is a profile row keyed by the Supabase auth uid. RBAC (`super_admin` + per-vertical `view`/`edit` grants), generic resource CRUD (`lib/resources.ts` registry), leads inbox, users (invite-by-email), audit. Sidebar vertical sections are collapsible. |
| `packages/db` | Drizzle schema + client + migrations + seed. **The one source of DB truth.** |
| ~~`packages/ui`~~ | Deleted 2026-09 (Phase 3) — was legacy Astro components, unused after the Next move. |
| `packages/shared` | `@delead/shared` — cross-app server helpers: `assetPublicUrl` (`/storage`), `snakeToCamel` (`/strings`), `verifyTurnstile` (`/turnstile`), `makeRevalidateRoute` (root, server-only). |
| `packages/brand` | Tailwind v4 theme tokens, per-vertical palette + font map, the `verticals.ts` registry. |
| `packages/config` | Shared tsconfig / prettier. |

## Rules

- **Secrets** live only in `.env` (gitignored). Never hardcode. `.env.example` documents the keys.
- **Node 24** everywhere (`.nvmrc`, `engines`, CI). Shared toolchain versions live in the
  **pnpm catalog** in `pnpm-workspace.yaml` — reference as `"catalog:"`, don't pin per-app.
- **Before committing**: `pnpm typecheck` (must pass — CI gates on it) and, when touching
  `lib/authz` `lib/rbac` `lib/csv` `lib/resource-access` `lib/utils` or an API route,
  `pnpm --filter @delead/dashboard test` (Node's built-in runner; add a case).
- **Supabase**: project `dslvxzcqcuqhfqqaohfb` (Mumbai). Postgres via Drizzle over the pooler.
  **Supabase Auth** is used (dashboard only) — that's the one accepted coupling; a Postgres
  move is otherwise an env change. **No RLS by decision** ("stay portable") — tenant isolation
  is app-layer: every content mutation MUST go through `guard()` + `scopeById()` in
  `lib/actions/content.ts` (pins the WHERE to the caller's vertical and rejects a resource
  that doesn't belong to it). Two DB roles: `DATABASE_URL` = `delead_web_app` (dashboard +
  write APIs), `DATABASE_URL_RO` = `delead_web_ro` (marketing sites, SELECT-only) — see
  `packages/db/scripts/roles.sql`. Sites read via `getReadDb()`, dashboard via `getDb()`.
  Storage → **Cloudflare R2** (decided; `STORAGE_PROVIDER`, adapter in
  `apps/dashboard/lib/storage.ts`); on Supabase Storage for now.
- **Lead / booking webhooks** (Google Sheet mirror) go through the `outbox` table — written in
  the same tx as the lead/booking, drained opportunistically + by `.github/workflows/outbox.yml`.
- **DB changes**: edit `packages/db/src/schema.ts`, then `pnpm --filter @delead/db generate`
  (migration) **and** `pnpm --filter @delead/db schema` (refresh `packages/db/schema.sql`), then
  `pnpm --filter @delead/db migrate`. Commit all three. See `packages/db/CLAUDE.md`.
  `pnpm --filter @delead/db populate` re-seeds all site content (images → Supabase Storage +
  rows); its copy strings must stay byte-identical to the approved site markup.
- **Publish flow**: sites use ISR, not rebuilds. Dashboard "Publish" (`publishVertical`)
  POSTs `<SITE_URL_*>/api/revalidate` with `REVALIDATE_SECRET`. No Cloudflare build hooks.
- **Marketing sites are pixel-frozen**: the designs are client-approved. Copy the original
  `styles.css`/`main.js` verbatim; convert only markup; diff every change against the sibling
  static folder (`python3 -m http.server 8899 --directory "../<Name>"`). Animation budget:
  the site's own `main.js` (CSS + one IntersectionObserver). No new Lenis/GSAP on these five
  (TinkerChamps keeps its existing Lenis / WebGL / framer-motion — those are
  client components and orthogonal to ISR.)
- **Subdomains**: `w2l` `mc` `tc` `corporate` `edu` `admin` on `deleadint.com`
  (`walk2lead`/`makerchamps`/`tinkerchamps` 301 → short forms).
- **Vercel deploy state (2026-09)**: all 7 apps are live as separate Vercel projects
  (`delead-dashboard`, `deleadint`, `walk2lead`, `makerchamps`, `delead-corporate`,
  `dli-education`, `tinkerchamps`), all building from this repo. **Custom domains not cut
  over yet** — serving on `*.vercel.app`. Two env sets live in the sibling `../env/<app>/`
  folder (outside the repo): `.env` = real custom-domain values, `.env.vercel` = the
  `*.vercel.app` testing values currently in Vercel. On cutover, swap `SITE_URL_*` +
  `NEXT_PUBLIC_*_ENDPOINT` back to `.env` and redeploy (dashboard first — it holds the
  `/api/lead` + `/api/booking` CORS allow-list, keyed on `SITE_URL_*`).
- **Every Vercel project has Ignored Build Step = "Only build if there are changes"**
  (Settings → Build & Deployment) so a one-app change only rebuilds that project; shared
  `packages/*` changes still rebuild every dependent. Don't revert it to "Automatic".
- **Keep-alive**: `.github/workflows/supabase-ping.yml` + `outbox.yml` both need the
  `DIRECT_URL` **repo secret** (set) — session-pooler URL, `:5432`. Vercel Cron
  `/api/cron/ping` (daily) is the second pinger.
- **DNS is Hostinger, mail is Zoho** (a Cloudflare-DNS migration is planned — see `docs/DEPLOY.md`).
  Never touch `MX` or mail `TXT`/`CNAME` (SPF/DKIM/DMARC) records.
- Dev ports: dashboard 3100, tinkerchamps 3200, deleadint 4321, walk2lead 4322, makerchamps 4323,
  corporate 4324, dli-education 4325. `pnpm dev` runs all; or `pnpm --filter <name> dev`.
  (`next dev` — `next start` does **not** work with `output: standalone`; use
  `node .next/standalone/…/server.js` or a dev server for local checks.)
- Seeded admin: `webdelead@gmail.com` (change the password on first real login).
