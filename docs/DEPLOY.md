# Deploy runbook — De' Lead Web

Repo: `github.com/webdelead/De-Lead-Web` · Supabase project `dslvxzcqcuqhfqqaohfb` (Mumbai)

## 0. What's already done

- DB schema migrated + seeded on Supabase (admin `webdelead@gmail.com`, real content from the old sites).
- TinkerChamps content imported off Sanity (1 event, 17 gallery, 3 reviews → Supabase Storage).
- All 7 apps build locally against the live DB.

## 1. GitHub secrets (Settings → Secrets and variables → Actions)

| Secret | Value (from `.env`) |
|---|---|
| `DATABASE_URL` | transaction pooler URI `:6543` |
| `DIRECT_URL` | session pooler URI `:5432` |
| `SUPABASE_URL` | `https://dslvxzcqcuqhfqqaohfb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role JWT |
| `AUTH_SECRET` | from `.env` |

The `supabase-ping` workflow only needs `DIRECT_URL`. Run it once manually
(Actions → Supabase keep-alive → Run workflow) to confirm.

## 2. Cloudflare Pages — 5 static sites

For **each** of `deleadint · walk2lead · makerchamps · corporate · dli-education`:

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → `webdelead/De-Lead-Web`.
2. **Build configuration**
   - Framework preset: **Astro**
   - Build command: `pnpm install && pnpm --filter @delead/site-<name> build`
     (names: `site-deleadint`, `site-walk2lead`, `site-makerchamps`, `site-corporate`, `site-dli-education`)
   - Build output directory: `apps/<name>/dist`
   - Root directory: `/` (repo root)
3. **Settings → Builds → Build watch paths**: `apps/<name>/*` and `packages/*`
   (so a push only rebuilds the sites that changed — keeps you under the 500 builds/mo free cap).
4. **Environment variables** (Production + Preview):
   - `DATABASE_URL` = transaction pooler URI
   - `SUPABASE_URL` = `https://dslvxzcqcuqhfqqaohfb.supabase.co`
   - `PUBLIC_LEAD_ENDPOINT` = `https://admin.deleadint.com/api/lead`
   - `SITE_URL_<VERTICAL>` for its own canonical (optional; falls back to the default host)
5. **Custom domains** → add the subdomain:
   | Site | Domain | 301 alias also add |
   |---|---|---|
   | deleadint | `deleadint.com` + `www.deleadint.com` | — |
   | walk2lead | `w2l.deleadint.com` | `walk2lead.deleadint.com` |
   | makerchamps | `mc.deleadint.com` | `makerchamps.deleadint.com` |
   | corporate | `corporate.deleadint.com` | — |
   | dli-education | `edu.deleadint.com` | — |
   Cloudflare shows a **CNAME target** (e.g. `de-lead-web-w2l.pages.dev`).
6. **Hostinger DNS**: add `CNAME <sub> → <target>.pages.dev`. Leave every `MX`, `TXT`
   (SPF/DKIM/DMARC) and `autoconfig`/`autodiscover` record untouched — **Zoho mail is unaffected**.
7. **Settings → Builds → Deploy hooks** → create one → paste its URL into the root `.env`
   as `DEPLOY_HOOK_<VERTICAL>` and into the dashboard's Vercel env. This is what the
   dashboard's "Publish to site" button calls.

## 3. Vercel — dashboard + tinkerchamps

Two projects, same repo:

| Project | Root Directory | Domain |
|---|---|---|
| dashboard | `apps/dashboard` | `admin.deleadint.com` |
| tinkerchamps | `apps/tinkerchamps` | `tc.deleadint.com` (+ alias `tinkerchamps.deleadint.com`) |

1. Add New Project → import `webdelead/De-Lead-Web` → set **Root Directory**.
2. Framework auto-detects (Next.js). Install command `pnpm install` (default).
3. **Environment variables** — dashboard needs everything from `.env`:
   `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `AUTH_SECRET`, `STORAGE_PROVIDER=supabase`,
   `APPS_SCRIPT_URL_*` (all six), `DEPLOY_HOOK_*` (all five), `PUBLIC_LEAD_ENDPOINT`,
   `SITE_URL_*` (all seven).
   tinkerchamps needs `DATABASE_URL`, `SUPABASE_URL`, `APPS_SCRIPT_URL_TINKERCHAMPS`.
4. Add the custom domains → CNAME in Hostinger DNS (MX/TXT untouched).
5. Vercel Hobby is technically non-commercial; for one low-traffic admin + one site this
   is the pragmatic choice. Move tinkerchamps to Cloudflare later if the 100 GB/mo
   bandwidth cap is approached.

## 4. Post-deploy checklist

- [ ] `admin.deleadint.com` → sign in as `webdelead@gmail.com` / `DLI_site_3841`.
- [ ] Immediately change that password (top-right menu → Profile).
- [ ] Users → invite the real staff, grant per-vertical access.
- [ ] Submit a test enquiry on each marketing site → appears under **Leads**.
- [ ] TinkerChamps → gallery / events / reviews render; make a test booking → **Bookings**.
- [ ] Edit a testimonial in the dashboard → **Publish to site** → confirm the CF rebuild.
- [ ] Run the Supabase keep-alive workflow once.

## 5. Still to wire (client-provided)

| Item | Where |
|---|---|
| Per-site **Apps Script Web App URLs** (new Google Sheets, one per marketing site) | `.env` / Vercel `APPS_SCRIPT_URL_DELEADINT` … `_DLI_EDUCATION`. Until set, leads are still saved to Postgres; only the Sheet mirror + notification email is skipped. |
| **Deploy hooks** (created in step 2.7) | `.env` / Vercel `DEPLOY_HOOK_*` |
| **Cloudflare R2** (optional, later) | set `R2_*`, run `pnpm --filter @delead/db migrate:storage`, flip `STORAGE_PROVIDER=r2`, redeploy. No code changes. |
| Real **starter blog posts** — 3 are seeded from brochure facts, flagged for edit | dashboard → De' Lead International → Journal |
| **OG images** (`/og.jpg` per site) | drop into each `apps/<name>/public/` |

## 6. Local dev

```bash
pnpm install
pnpm --filter @delead/dashboard dev        # http://localhost:3100
pnpm --filter @delead/site-deleadint dev    # http://localhost:4321
pnpm --filter @delead/site-tinkerchamps dev # http://localhost:3200
```
