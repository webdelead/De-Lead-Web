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

### Keep-alive runs from two places (redundant)

Supabase free pauses after ~7 days idle. Two independent pingers so one failing
doesn't matter — both write a row to `ping_log` with a distinct `source`, and the
dashboard home + System page show the latest:

| Pinger | Cadence | `ping_log.source` |
|---|---|---|
| GitHub Actions (`.github/workflows/supabase-ping.yml`) | Mon/Wed/Fri/Sun | `github` |
| Vercel Cron on the dashboard (`apps/dashboard/vercel.json` → `/api/cron/ping`) | daily | `vercel` |

Vercel Cron needs a `CRON_SECRET` env var on the dashboard project (any long random
string) — Vercel sends it as `Authorization: Bearer <CRON_SECRET>` and the route rejects
anything else.

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

## 5. Apps Script — per-site Sheet backup + email notifier

The dashboard is the source of truth. Each site *also* mirrors its submissions to
its own Google Sheet and emails the team — a backup and a familiar view for staff.

For **each** marketing site (and one for TinkerChamps bookings — already exists):

1. New Google Sheet → Extensions → Apps Script.
2. Paste [`docs/apps-script/Code.gs`](apps-script/Code.gs) (identical for every site).
   It appends a row and emails **info@deleadint.com, arjun@deleadint.com** on every submission.
   Change `NOTIFY_TO` in the file if the recipients differ per site.
3. Deploy → New deployment → **Web app** · Execute as **Me** · Who has access **Anyone**.
4. Authorise (it asks for Sheet + Gmail send permission the first time).
5. Copy the `/exec` URL → set it in `.env` **and** the dashboard's Vercel env as
   `APPS_SCRIPT_URL_<SITE>` (`_DELEADINT`, `_WALK2LEAD`, `_MAKERCHAMPS`, `_CORPORATE`, `_DLI_EDUCATION`).
6. Redeploy the dashboard so it picks up the new var.

Until a URL is set, submissions still save to Postgres — only the Sheet row + email are skipped.

## 6. Move DNS to Cloudflare (optional, mail-safe)

Cloudflare DNS is free and adds DDoS protection, DNSSEC, analytics and a WAF for the
web records. Moving DNS does **not** move mail — you re-create the exact Zoho records.

**Before you start:** in Hostinger DNS, record **every** current entry, especially:
- all `MX` records (Zoho: `mx.zoho.in` / `mx2.zoho.in` / `mx3.zoho.in`, or the `.com` set)
- `TXT` SPF: `v=spf1 include:zohomail.in ~all` (or `.com`)
- `TXT`/`CNAME` DKIM: the `*._domainkey` record Zoho gave you
- `TXT` DMARC: `_dmarc`
- any `CNAME` for `autoconfig` / `autodiscover` / webmail
Zoho's authoritative list is in **Zoho Mail Admin → Domains → your domain → DNS**.

**Migration:**
1. Add the domain at Cloudflare (Free plan). It scans and imports most records.
2. **Verify every MX and every mail TXT/CNAME matches Zoho exactly.** Add any it missed.
3. Set all mail records (MX, SPF, DKIM, DMARC, autodiscover) to **DNS only (grey cloud)** —
   never proxied. Cloudflare's proxy is HTTP-only and would break mail.
4. Web records (the `A`/`CNAME` for the sites + `admin`/`tc`) may be **Proxied (orange)**
   for the WAF/security benefit — or left grey to start.
5. At the **registrar** (where the domain is registered — likely Hostinger): change the
   nameservers to the two Cloudflare gives you.
6. Propagation: ~1–24h. Old and new DNS both answer during this window; because both carry
   identical MX, there is **no mail gap**.
7. After propagation: send + receive a test mail; run an SPF/DKIM/DMARC check
   (mxtoolbox.com or mail-tester.com).
8. Keep the Hostinger DNS zone intact for ~48h as rollback (switch nameservers back if needed).

Your reasoning is sound: the security upside is real, and mail is safe **as long as the
MX + SPF/DKIM/DMARC records are copied faithfully and kept unproxied.** That's the whole risk.

## 7. Still to wire (client-provided)

| Item | Where |
|---|---|
| Per-site **Apps Script URLs** (§5) | `.env` / Vercel `APPS_SCRIPT_URL_*` |
| **Deploy hooks** (created in §2.7) | `.env` / Vercel `DEPLOY_HOOK_*` |
| **`CRON_SECRET`** for the Vercel keep-alive | dashboard Vercel env |
| **Cloudflare R2** (optional, later) | set `R2_*`, run `pnpm --filter @delead/db migrate:storage`, flip `STORAGE_PROVIDER=r2`, redeploy. No code changes. |
| Real **starter blog posts** — 3 seeded from brochure facts, flagged for edit | dashboard → De' Lead International → Journal |
| **OG images** (`/og.jpg` per site) | drop into each `apps/<name>/public/` |

## 8. Local dev

```bash
pnpm install
pnpm dev                                     # all 7 apps (Turborepo)
# or individually:
pnpm --filter @delead/dashboard dev          # http://localhost:3100
pnpm --filter @delead/site-deleadint dev     # http://localhost:4321
pnpm --filter @delead/site-walk2lead dev     # http://localhost:4322
pnpm --filter @delead/site-makerchamps dev   # http://localhost:4323
pnpm --filter @delead/site-corporate dev     # http://localhost:4324
pnpm --filter @delead/site-dli-education dev  # http://localhost:4325
pnpm --filter @delead/site-tinkerchamps dev  # http://localhost:3200
```
