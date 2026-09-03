# @delead/db — the one source of DB truth

`src/schema.ts` (Drizzle) defines every table. Everything else here derives from it.

## Changing the schema

1. Edit `src/schema.ts`.
2. `pnpm --filter @delead/db generate` — writes a new migration under `drizzle/`.
3. `pnpm --filter @delead/db schema` — regenerates `schema.sql` (the consolidated,
   human-readable DDL kept for reference; **commit it with the schema change**).
4. `pnpm --filter @delead/db migrate` — applies pending migrations to Supabase
   (uses `DIRECT_URL`, the session pooler).
5. Commit `src/schema.ts` + `drizzle/*` + `schema.sql` together.

`drizzle-kit push` exists for fast local iteration but **do not** use it against the
shared Supabase project — always go through a generated migration so history is tracked.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | Full DDL snapshot, for reference / manual restore. Regenerated, never hand-edited. |
| `drizzle/` | Ordered migrations (this is what `migrate` runs). |
| `scripts/seed.ts` + `seed-content.ts` | First-run data: admin user, publish_state, real content lifted from the old sites. Idempotent (seed-content only fills empty tables). |
| `scripts/import-sanity.ts` | One-off: pulled TinkerChamps events/gallery/reviews out of Sanity into Postgres + Supabase Storage. Already run. |
| `scripts/migrate-storage.ts` | One-off (later): copy every asset from Supabase Storage to Cloudflare R2, flip `provider`. |
| `scripts/ping.ts` | Keep-alive — inserts a `ping_log` row. `pnpm --filter @delead/db ping <source>` (source defaults to `cron`). |

## Connection

`DATABASE_URL` = transaction pooler (`:6543`), `prepare:false` — app runtime.
`DIRECT_URL` = session pooler (`:5432`) — migrations, seed, CI, cron.
Both are IPv4; free-tier direct `db.<ref>.supabase.co` is IPv6-only.
