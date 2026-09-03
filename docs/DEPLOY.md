# Deploy runbook — De' Lead Web

Repo: `github.com/webdelead/De-Lead-Web` · Supabase project `dslvxzcqcuqhfqqaohfb` (Mumbai)

## 0. What's already done

- DB schema migrated + seeded on Supabase (admin `webdelead@gmail.com`, real content from the old sites).
- TinkerChamps content imported off Sanity (1 event, 17 gallery, 3 reviews → Supabase Storage).
- All 7 apps are **Next 15** and build locally against the live DB. The 5 marketing
  sites were converted Astro → Next (2026-09) — 1:1 pixel ports, componentised, ISR.

## 1. GitHub secrets (Settings → Secrets and variables → Actions)

| Secret | Value (from `.env`) |
|---|---|
| `DATABASE_URL` | transaction pooler URI `:6543` |
| `DIRECT_URL` | session pooler URI `:5432` |
| `SUPABASE_URL` | `https://dslvxzcqcuqhfqqaohfb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role JWT |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from `.env` (dashboard login runs client-side) |

### Supabase Auth config (one-time, in the Supabase dashboard → Authentication)

- **URL Configuration → Redirect URLs**: add `https://admin.deleadint.com/**` and, for local dev, `http://localhost:3100/**`. Needed for the invite / password-reset email links.
- **Email templates**: the default "Invite" and "Reset password" templates work as-is.
- **SMTP**: the built-in sender is rate-limited (~a few emails/hour). For reliable invites/resets, set a custom SMTP (Authentication → SMTP Settings) — the company Zoho account works.

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

## 2. Marketing sites (5) — Vercel or VPS

All five (`deleadint · walk2lead · makerchamps · corporate · dli-education`) are Next 15
apps with `output: "standalone"` and on-demand ISR. **No build hooks, no Cloudflare Pages.**

### Option A — Vercel (one project per site)
1. Add New Project → import `webdelead/De-Lead-Web` → **Root Directory** `apps/<name>`.
2. Framework auto-detects Next.js. Build `pnpm install && pnpm --filter @delead/site-<name> build`.
3. **Environment variables** (Production + Preview):
   - `DATABASE_URL` = transaction pooler URI
   - `SUPABASE_URL` = `https://dslvxzcqcuqhfqqaohfb.supabase.co`
   - `NEXT_PUBLIC_LEAD_ENDPOINT` = `https://admin.deleadint.com/api/lead`
   - `REVALIDATE_SECRET` = the shared secret (identical on every site + the dashboard)
   - `SITE_URL_<VERTICAL>` = its own canonical origin
4. **Custom domains** → add the subdomain:
   | Site | Domain | 301 alias also add |
   |---|---|---|
   | deleadint | `deleadint.com` + `www.deleadint.com` | — |
   | walk2lead | `w2l.deleadint.com` | `walk2lead.deleadint.com` |
   | makerchamps | `mc.deleadint.com` | `makerchamps.deleadint.com` |
   | corporate | `corporate.deleadint.com` | — |
   | dli-education | `edu.deleadint.com` | — |
5. **Hostinger DNS**: add the `CNAME <sub> → <vercel target>`. Leave every `MX`, `TXT`
   (SPF/DKIM/DMARC) and `autoconfig`/`autodiscover` record untouched — **Zoho mail is unaffected**.

### Option B — single VPS ($6–12/mo), for when ticketing/CRM/payments land
- `pnpm install && pnpm -r --filter "./apps/*" build` → each app emits `.next/standalone`.
- Run each with `pm2`/systemd: `node apps/<name>/.next/standalone/apps/<name>/server.js`
  on its own port (4321–4325, 3100, 3200).
- `caddy` reverse-proxies by host:
  ```
  deleadint.com, www.deleadint.com { reverse_proxy localhost:4321 }
  w2l.deleadint.com               { reverse_proxy localhost:4322 }
  mc.deleadint.com                { reverse_proxy localhost:4323 }
  corporate.deleadint.com         { reverse_proxy localhost:4324 }
  edu.deleadint.com               { reverse_proxy localhost:4325 }
  admin.deleadint.com             { reverse_proxy localhost:3100 }
  tc.deleadint.com                { reverse_proxy localhost:3200 }
  ```
  Caddy gets certs automatically. Same env vars as Option A, in each service's environment.

### Publish (both options)
The dashboard "Publish to site" button `POST`s `<SITE_URL_*>/api/revalidate` with header
`x-revalidate-secret: <REVALIDATE_SECRET>`; the route calls `revalidatePath("/", "layout")`.
Effect is near-instant, costs no build. `git push` still triggers a normal redeploy for code.

## 3. Dashboard + TinkerChamps (Vercel)

Two projects, same repo:

| Project | Root Directory | Domain |
|---|---|---|
| dashboard | `apps/dashboard` | `admin.deleadint.com` |
| tinkerchamps | `apps/tinkerchamps` | `tc.deleadint.com` (+ alias `tinkerchamps.deleadint.com`) |

1. Add New Project → import `webdelead/De-Lead-Web` → set **Root Directory**.
2. Framework auto-detects (Next.js). Install command `pnpm install` (default).
3. **Environment variables** — dashboard needs everything from `.env`:
   `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `STORAGE_PROVIDER=supabase`, `CRON_SECRET`,
   `APPS_SCRIPT_URL_*` (all six), `NEXT_PUBLIC_LEAD_ENDPOINT`,
   `REVALIDATE_SECRET` (so "Publish" can reach the sites), `SITE_URL_*` (all seven).
   tinkerchamps needs `DATABASE_URL`, `SUPABASE_URL`, `REVALIDATE_SECRET`,
   `SITE_URL_TINKERCHAMPS`, `NEXT_PUBLIC_BOOKING_ENDPOINT`
   (its booking form POSTs to the dashboard's `/api/booking`, same as the marketing
   sites' lead forms — TC no longer writes bookings or calls Apps Script directly).
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
- [ ] `pnpm --filter @delead/db migrate` — applies the `outbox` table (migration `0002`).
- [ ] Provision the RO/APP roles (§5a) and set `DATABASE_URL_RO`.
- [ ] Trigger `.github/workflows/outbox.yml` once (`workflow_dispatch`) — expect `picked 0`.

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

**Reliable delivery (Phase 2).** The Sheet mirror is no longer a bare fire-and-forget
`fetch`. `/api/lead` and `/api/booking` write an `outbox` row in the *same transaction*
as the lead/booking, so it can't be lost if the request dies. Delivery:
- opportunistic — every `/api/lead` / `/api/booking` write also drains a few pending rows;
- periodic — `.github/workflows/outbox.yml` runs `pnpm --filter @delead/db outbox:flush`
  every 30 min (needs the `DIRECT_URL` GitHub secret). Retries with exponential backoff,
  gives up after 8 attempts (`status = 'failed'`, `last_error` recorded).

Apps Script quotas still apply (~100 emails/day on a consumer Google account) — a
campaign-day surge can still hit them, but nothing is silently dropped and the queue
drains once the quota resets.

## 5a. Portable RO / APP database roles (Phase 2)

Standard Postgres roles so an SSR bug on a marketing site can't write anything or read
`leads` / `users` / `audit_log` / `tc_bookings`. Works identically on Supabase and a
self-hosted droplet.

1. Set `DELEAD_WEB_RO_PASSWORD` and `DELEAD_WEB_APP_PASSWORD` in `.env` (strong, random).
2. `pnpm --filter @delead/db roles` — creates `delead_web_ro` (SELECT on content only)
   and `delead_web_app` (full DML, no DDL), applies grants + default privileges, and
   sets each to `LOGIN` with the password from the env var.
3. Build two connection strings (Supabase pooler username is `<role>.<project-ref>`):
   - `DATABASE_URL`    → `delead_web_app`  (dashboard + write APIs)
   - `DATABASE_URL_RO` → `delead_web_ro`   (the 5 marketing sites' SSR/ISR reads)
   Set both in `.env` and in each app's Vercel env. Migrations/seed keep using `DIRECT_URL`
   (the owner).
4. `getReadDb()` falls back to `DATABASE_URL` when `DATABASE_URL_RO` is unset, so you can
   roll this out one app at a time.

## 5b. Cloudflare Turnstile on the public forms (Phase 2)

Server-side check is wired into `/api/lead` and `/api/booking` but **inert** until
`TURNSTILE_SECRET_KEY` is set — and even then it only *logs* failures until you set
`TURNSTILE_ENFORCE=true` (monitor-first, because the pixel-frozen site forms don't send
a token yet).

1. Cloudflare dash → Turnstile → add a widget for `deleadint.com` + subdomains.
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (all site apps + dashboard) and
   `TURNSTILE_SECRET_KEY` (dashboard + tinkerchamps).
3. Add the widget to the forms and send its token as `turnstileToken` in the POST body.
   (Site form markup is client-approved / pixel-frozen — get sign-off on the widget
   placement before editing `apps/*/public` markup.)
4. Watch the logs for `turnstile check failed (monitor mode)`, then flip
   `TURNSTILE_ENFORCE=true`.

## 5c. Supabase Auth hardening (Phase 2 — dashboard toggles, no lock-in)

Supabase dashboard → Authentication:
- **Leaked-password protection**: on (HaveIBeenPwned check).
- **Bot & abuse protection / CAPTCHA**: on for the auth endpoints (Turnstile/hCaptcha).
- **URL Configuration → Redirect URLs**: allow-list only the exact
  `https://admin.deleadint.com/auth/callback` and `/reset-password` URLs.
- **Sessions / JWT expiry**: shorten to something sane for an admin tool (e.g. 1–8h).
- MFA (TOTP): **deferred by decision** — revisit if the team grows.

## 5d. Backups become your job on a droplet

While on Supabase you get daily backups. The day Postgres moves to a `$6` droplet
(the "stay portable" plan), set up your own: a `pg_dump` cron + an off-box copy
(e.g. to R2). No app change — just don't forget it during the cutover.

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
| **`REVALIDATE_SECRET`** — one shared value on every site **and** the dashboard | `.env` / each host's env |
| **`CRON_SECRET`** for the Vercel keep-alive | dashboard Vercel env |
| **Cloudflare R2** (optional, later) | set `R2_*`, run `pnpm --filter @delead/db migrate:storage`, flip `STORAGE_PROVIDER=r2`, redeploy. No code changes. |
| Real **starter blog posts** — 3 seeded from brochure facts, flagged for edit | dashboard → De' Lead International → Journal |
| **OG images** (`/og.jpg` per site) | drop into each `apps/<name>/public/`; each `app/layout.tsx` already points `openGraph.images` at a per-site logo as a placeholder |

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
