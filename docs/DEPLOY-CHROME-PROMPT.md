# One-shot deploy prompt for Claude-in-Chrome

Paste everything between the lines into the Chrome extension. It has all env values
except real secrets — for those it says "copy from the user's `.env`". Have the
`De Lead Web/.env` file open so you can paste those when asked.

---

You are deploying the **De' Lead Web** monorepo (`github.com/webdelead/De-Lead-Web`, branch `main`).
I have Vercel, Supabase, and GitHub open in this browser, all logged in as the owner.
Work through the sections **in order**. After the FIRST Vercel project builds green, STOP and
let me confirm before doing the other six. Never touch MX / SPF / DKIM / DMARC DNS records.

## SECTION 1 — GitHub (2 min)

1. Go to `https://github.com/webdelead/De-Lead-Web/settings/security_analysis`.
2. Click **Enable** for: Dependency graph, then Dependabot alerts, then Dependabot security updates.
   (Leave "Dependabot version updates" — it's already configured by a committed file.)

## SECTION 2 — Supabase (3 min)

Project: **De Lead Web** (`dslvxzcqcuqhfqqaohfb`). Go to Authentication.

1. **URL Configuration → Site URL**: change `http://localhost:3000` to
   `https://admin.deleadint.com`. Save.
2. **URL Configuration → Redirect URLs**: confirm these two exist (add any missing):
   - `https://admin.deleadint.com/auth/callback`
   - `https://admin.deleadint.com/reset-password`
3. **Sessions**: set the JWT / access-token expiry to `28800` seconds (8 hours). Save.
4. **Attack Protection**: leave "Enable Captcha protection" OFF for now (we don't have a
   Turnstile secret yet). If it's currently ON with an empty secret, turn it OFF and Save.

## SECTION 3 — Vercel: create 7 projects

For **each** row below: Vercel dashboard → **Add New… → Project** → import
`webdelead/De-Lead-Web` → then:

- **Root Directory**: set to the path in the table. In the Root Directory picker, tick
  **"Include files outside of the Root Directory in the Build Step"** (needed — the app
  depends on `packages/*`).
- **Framework Preset**: Next.js (should auto-detect).
- **Install Command**: `pnpm install`  (leave Build/Output as default first; only override if the build fails — then Build Command = `pnpm --filter <PKG> build`).
- **Environment Variables**: add every variable from that project's block in SECTION 4.
- Click **Deploy**. Wait for it to finish.
- Then **Settings → Domains** → add the domain(s) in the table. Vercel will show a DNS
  record (usually a CNAME) — add it in **Hostinger DNS** (hPanel → Domains → deleadint.com →
  DNS/Nameservers → Manage DNS records). Add ONLY the record Vercel asks for. Do not edit or
  delete any `MX`, `TXT` (SPF/DKIM/DMARC), `autoconfig`, or `autodiscover` record.

| # | Vercel project name | Root Directory | Package name (`<PKG>`) | Domains to add |
|---|---|---|---|---|
| 1 | delead-dashboard | `apps/dashboard` | `@delead/dashboard` | `admin.deleadint.com` |
| 2 | delead-deleadint | `apps/deleadint` | `@delead/site-deleadint` | `deleadint.com`, `www.deleadint.com` |
| 3 | delead-walk2lead | `apps/walk2lead` | `@delead/site-walk2lead` | `w2l.deleadint.com` (+ `walk2lead.deleadint.com` → redirects to w2l) |
| 4 | delead-makerchamps | `apps/makerchamps` | `@delead/site-makerchamps` | `mc.deleadint.com` (+ `makerchamps.deleadint.com` → redirects to mc) |
| 5 | delead-corporate | `apps/corporate` | `@delead/site-corporate` | `corporate.deleadint.com` |
| 6 | delead-dli-education | `apps/dli-education` | `@delead/site-dli-education` | `edu.deleadint.com` |
| 7 | delead-tinkerchamps | `apps/tinkerchamps` | `@delead/site-tinkerchamps` | `tc.deleadint.com` (+ `tinkerchamps.deleadint.com` → redirects to tc) |

**Do project 1 (dashboard) first. After it deploys green and `admin.deleadint.com` loads a
login page, stop and tell me.** Then continue 2–7.

For the redirect aliases (walk2lead/makerchamps/tinkerchamps long forms): after adding the
short domain, add the long one too and Vercel will offer "Redirect to <short>" — choose that.

## SECTION 4 — Environment variables per project

Add these under **Production** (and Preview, same values). Where it says
`<<from .env>>`, ask me and I'll paste the value from the `.env` file.

### delead-dashboard
```
DATABASE_URL=<<from .env>>
DIRECT_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
SUPABASE_ANON_KEY=<<from .env>>
SUPABASE_SERVICE_ROLE_KEY=<<from .env>>
NEXT_PUBLIC_SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<<from .env>>
AUTH_SECRET=<<from .env>>
STORAGE_PROVIDER=supabase
CRON_SECRET=c09f86d7e716173469dfa4b5fd6e67b1992273eb4206ee1e71f3ade150f03c5e
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_DELEADINT=https://deleadint.com
SITE_URL_WALK2LEAD=https://w2l.deleadint.com
SITE_URL_MAKERCHAMPS=https://mc.deleadint.com
SITE_URL_CORPORATE=https://corporate.deleadint.com
SITE_URL_DLI_EDUCATION=https://edu.deleadint.com
SITE_URL_TINKERCHAMPS=https://tc.deleadint.com
SITE_URL_DASHBOARD=https://admin.deleadint.com
APPS_SCRIPT_URL_DELEADINT=https://script.google.com/macros/s/AKfycbzaKSDLqwSjYrWLAXqR-6qzxy6OzsScbnUpnLvumgDK8HW0RmCrdeJIz4TEBbwzg65X/exec
APPS_SCRIPT_URL_WALK2LEAD=https://script.google.com/macros/s/AKfycbyqVKowhmqrD1u1Xt5qKgzND3fpihgfiuI7ZnIi-inhm7JVF-wgwAmXXWq2EHzYylTBrg/exec
APPS_SCRIPT_URL_MAKERCHAMPS=https://script.google.com/macros/s/AKfycbySyamNFm289wO1WmiMJ2ISM4lD0PoYJ3dKPZUbP8XGRNN50zD03ILqRgrM0lkHQ_0p/exec
APPS_SCRIPT_URL_CORPORATE=https://script.google.com/macros/s/AKfycbwjtvTAzPFnanne5Pvp4x5smuMDxAwT0okZX1Bp0Nc2mHJSjbqHFOcZCHheSX5N36DGPw/exec
APPS_SCRIPT_URL_DLI_EDUCATION=https://script.google.com/macros/s/AKfycbwkuaVA9GCnBgMxDVVEJy7lpokIJ81OXKUst3WRx-ep4qxU2uTSnO4yUrgGKdu3IIHxlQ/exec
APPS_SCRIPT_URL_TINKERCHAMPS=https://script.google.com/macros/s/AKfycbxEbaNm8YFwOyQHlLlXsmFxCKv0f9FxnYgjIZ6z_uYFidX35maEgFAKxSSgpP6JU3lC/exec
```

### delead-deleadint
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_DELEADINT=https://deleadint.com
```

### delead-walk2lead
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_WALK2LEAD=https://w2l.deleadint.com
```

### delead-makerchamps
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_MAKERCHAMPS=https://mc.deleadint.com
```

### delead-corporate
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_CORPORATE=https://corporate.deleadint.com
```

### delead-dli-education
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_LEAD_ENDPOINT=https://admin.deleadint.com/api/lead
SITE_URL_DLI_EDUCATION=https://edu.deleadint.com
```

### delead-tinkerchamps
```
DATABASE_URL=<<from .env>>
SUPABASE_URL=https://dslvxzcqcuqhfqqaohfb.supabase.co
REVALIDATE_SECRET=cfeccdf5abeca6814b8c85fa2cf711108b6df651742de393
NEXT_PUBLIC_BOOKING_ENDPOINT=https://admin.deleadint.com/api/booking
SITE_URL_TINKERCHAMPS=https://tc.deleadint.com
```
(TinkerChamps no longer writes bookings itself — the form POSTs to the dashboard's
`/api/booking`, same as the marketing sites' lead forms. `APPS_SCRIPT_URL_TINKERCHAMPS`
lives only in the **dashboard** project now.)

## SECTION 5 — Vercel Cron secret (dashboard only)

The dashboard has a `vercel.json` cron. In **delead-dashboard → Settings → Environment
Variables** confirm `CRON_SECRET` is set (it's in the block above). Vercel Cron sends it
automatically as the Authorization header — nothing else to do.

## SECTION 6 — Post-deploy smoke test

1. `https://admin.deleadint.com` → sign in `webdelead@gmail.com` / `DLI_site_3841` →
   immediately change the password (top-right menu → Account).
2. Open each marketing site's URL — it should render. Submit a test enquiry on one → check
   it shows under **Leads** in the dashboard.
3. `https://tc.deleadint.com` → gallery/events/reviews render → make a test booking →
   check **Bookings** in the dashboard.
4. Dashboard → any content page → edit an item → **Publish to site** → the change should
   appear on the live site within a few seconds.

Report back after Section 3 project 1, and again when all 7 are green.
