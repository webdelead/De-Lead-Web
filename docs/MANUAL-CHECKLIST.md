# What you need to do / decide

Everything the phase branches couldn't do in code. Grouped by urgency, not by phase.
Most of it is optional hardening you can do gradually — the **Required now** list is short.

---

## ✅ Required now (before real use)

1. ~~**Run the DB migration** (`outbox` table)~~ — **DONE** (migrations 0002 + 0003 applied to prod).
2. ~~**Vercel → Node 24** in each project~~ — **DONE** (all 7 projects).
3. ~~**Check CI is green**~~ — **DONE** (green on `main`).
4. ~~**Deploy all 7 apps + wire keep-alive**~~ — **DONE.** All live on `*.vercel.app`;
   `supabase-ping.yml` + `outbox.yml` have the `DIRECT_URL` repo secret; both run green.

**Still on you:**
- **Change the seeded admin password** (`webdelead@gmail.com`) — first login → account menu.
- **Enable "Dependabot security updates"** — GitHub → Settings → Advanced Security (alerts + graph already on).
- **Smoke-test** each `.vercel.app` site's form → dashboard **Leads** / **Bookings** (see below).

---

## 🌐 Custom-domain cutover (when DNS is ready)

Currently every project serves on `*.vercel.app` and Vercel env holds the values from
`../env/<app>/.env.vercel`. The real values are in `../env/<app>/.env`. To cut over:

1. In each Vercel project → Settings → Domains → add the real host → add the CNAME it shows
   in **Hostinger DNS** (never touch MX / SPF / DKIM / DMARC).
2. Swap `SITE_URL_*` and `NEXT_PUBLIC_LEAD_ENDPOINT` / `NEXT_PUBLIC_BOOKING_ENDPOINT` in
   Vercel env from the `.env.vercel` values back to the `.env` values.
   Helper: `../push-vercel-env.sh` (edit the map/source file) or the dashboard UI.
3. Redeploy — **dashboard first** (it holds the lead/booking CORS allow-list), then the sites.
4. Supabase → Auth → URL Configuration → set Site URL + redirect URLs to `admin.deleadint.com`.

### Testing the Google Sheet / email path without spamming real inboxes
In each vertical's Apps Script (`Extensions → Apps Script` from its Sheet): change the
notification recipient to a test address, **Save**, then **Deploy → Manage deployments →
Edit (pencil) → New version → Deploy** (keeps the same `/exec` URL — do NOT create a new
deployment). Revert + redeploy the same way when done, and delete test rows from the Sheet.
Better: read the recipient from a Script Property (`NOTIFY`) so you flip it with no redeploy.

---

## 🚦 Decisions (needed before a real traffic push, not before launch)

- **Postgres host.** Free Supabase will hit connection/egress limits first under load.
  Either budget **Supabase Pro (~$25/mo)** or start the **$6 droplet** migration (you then
  own backups + pooling — see `docs/DEPLOY.md` §5d). No rush until you're about to promote.
- **Image host — you said "in a few days".** When ready: Cloudflare R2 (the adapter is
  built). Steps are in "Optional" below.

---

## 🛡️ Optional hardening (do gradually; nothing breaks without it)

### Turnstile (bot check on the lead + booking forms)
Currently **does nothing** — the server code is inert until you add keys.
1. Cloudflare dashboard → **Turnstile** → Add widget → domain `deleadint.com` (covers subdomains).
2. Copy the **Site Key** and **Secret Key**.
3. In each site's Vercel env: `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>`.
   In dashboard + tinkerchamps Vercel env: `TURNSTILE_SECRET_KEY=<secret key>`.
4. Add the Turnstile widget `<div>` to each form and send its token as `turnstileToken`
   in the POST body. *(This edits the client-approved site markup — get sign-off first.)*
5. Once forms send tokens and you've watched the logs for false failures, set
   `TURNSTILE_ENFORCE=true`.

### Supabase Auth toggles (Supabase dashboard → Authentication)
- **Attack Protection** → turn on **leaked-password protection** and the **CAPTCHA** option.
- **URL Configuration → Redirect URLs** → keep only the exact
  `https://admin.deleadint.com/auth/callback` and `.../reset-password`.
- **Sessions** → shorten the JWT / session expiry (e.g. 8h) for an admin tool.
- MFA: skipped by your decision.

### `CRON_SECRET` (optional)
The Vercel keep-alive cron route is soft-guarded, so this is optional. If you want it
locked: generate a value (`openssl rand -base64 33`), set `CRON_SECRET` in the dashboard's
Vercel env — Vercel Cron sends it automatically.

### RO / APP database roles (portable, defence-in-depth)
Splits DB access so a bug on a marketing site can't read `leads`/`users` or write anything.
Everything works without it (falls back to one connection).
1. Put strong random values in `.env`: `DELEAD_WEB_RO_PASSWORD`, `DELEAD_WEB_APP_PASSWORD`.
2. `pnpm --filter @delead/db roles`
3. Build two connection strings (Supabase pooler user = `<role>.<project-ref>`):
   `DATABASE_URL` → `delead_web_app`, `DATABASE_URL_RO` → `delead_web_ro`. Set both in
   every app's Vercel env. Details: `docs/DEPLOY.md` §5a.

### Dependabot
Config is committed (`.github/dependabot.yml`). GitHub usually auto-enables it — check
Settings → Code security. Nothing else to do.

---

## 📦 Image host → Cloudflare R2 (when you're ready — "a few days")

1. Cloudflare → R2 → create a bucket + an API token (Object Read & Write).
2. Fill `.env`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
   `R2_PUBLIC_BASE_URL` (a public custom domain or the r2.dev URL).
3. Copy existing images across: `pnpm --filter @delead/db migrate:storage`
4. Set `STORAGE_PROVIDER=r2` in every app's Vercel env, redeploy.
5. Confirm a site image loads from the R2 URL, then delete the Supabase Storage originals.

---

## 🔬 How to load-test (before promoting to real traffic)

Install a load tool (`brew install oha` — or `k6`, `bombardier`). Then:

```bash
# 50 concurrent clients, 30s, against the lead endpoint
oha -z 30s -c 50 -m POST \
  -H 'content-type: application/json' \
  -d '{"source":"deleadint","name":"loadtest"}' \
  https://admin.deleadint.com/api/lead

# same for booking
oha -z 30s -c 50 -m POST -H 'content-type: application/json' \
  -d '{"parentName":"x","studentName":"x","classGrade":"8","phone":"0","place":"x"}' \
  https://tc.deleadint.com/api/booking

# cold ISR regen: publish, then hit the homepage
curl -X POST -H "x-revalidate-secret: <REVALIDATE_SECRET>" https://deleadint.com/api/revalidate
oha -z 15s -c 30 https://deleadint.com/
```

While it runs, watch:
- **Supabase dashboard → Database → Connection Pooling** graph — if it pins at the max, you
  need Pro / the droplet.
- **Vercel → project → Logs / Observability** — p95 function duration. Spiking = same conclusion.

---

## Deferred code work (I can do these on request — not blocking)

- **Phase 3b:** Next 15 → 16 + React 19.2 for the 6 non-TC apps. Needs a visual diff of each
  marketing site against its `../<Name>` static folder (pixel-frozen).
- ~~**Phase 4b:** journal block / rich-text editor (TipTap)~~ — **DONE.** After `migrate`,
  optionally run `pnpm --filter @delead/db blog:json` to convert existing posts so they
  open in the editor (the renderer falls back to their Markdown otherwise).
- **Phase 4b:** marketing-site CSP (needs per-site testing vs Google Fonts / external images).
- **Phase 5b:** server-side search + pagination on dashboard content lists — only matters
  once a single list exceeds ~500 rows (you're far from that).
- **Phase 5b:** granular ISR revalidation — only matters once a site is genuinely multi-page.
