# De' Lead Web — Build Plan & Spec

Single monorepo, one Supabase backend, one admin dashboard, seven front-ends.
Nothing in the existing project folders is touched — this all lives in `De Lead Web/`.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done · `⛔` blocked on client input

---

## 1. Repository layout

```
De Lead Web/
├─ apps/
│  ├─ deleadint/       Next    → deleadint.com                (hub)
│  ├─ walk2lead/       Next    → w2l.deleadint.com            (alias: walk2lead.deleadint.com → 301)
│  ├─ makerchamps/     Next    → mc.deleadint.com             (alias: makerchamps.deleadint.com → 301)
│  ├─ corporate/       Next    → corporate.deleadint.com
│  ├─ dli-education/    Next    → edu.deleadint.com            (/, /students, /professionals)
│  ├─ tinkerchamps/    Next    → tc.deleadint.com             (alias: tinkerchamps.deleadint.com → 301; migrated off Sanity)
│  └─ dashboard/       Next    → admin.deleadint.com          (the single dashboard)
├─ packages/
│  ├─ db/       Drizzle schema + typed client + migrations + seed  (@delead/db)
│  ├─ ui/       legacy shared Astro components — no longer imported (kept for reference)  (@delead/ui)
│  ├─ brand/    design tokens, tailwind preset, fonts, per-vertical palettes  (@delead/brand)
│  └─ config/   shared tsconfig / eslint / prettier  (@delead/config)
├─ .github/workflows/
│  ├─ supabase-ping.yml     cron, keeps the free project awake (4×/week)
│  └─ ci.yml                typecheck + build on PR
├─ docs/PLAN.md   (this file)
├─ .env           real secrets, gitignored
└─ turbo.json / pnpm-workspace.yaml / package.json
```

Package manager **pnpm 9** + **Turborepo 2**. Node ≥ 20.11.

---

## 2. Stack (locked)

| Concern | Choice | Notes |
|---|---|---|
| Marketing sites | **Next 15** (App Router, RSC) — converted from Astro 2026-09 | `output: "standalone"`. Each is a **1:1 pixel port** of the client-approved static design: original `css/styles.css` + `js/main.js` copied verbatim into `public/`, markup componentised into `components/S01_*`…`SNN_*` (split by `scripts/html2jsx.mjs`). |
| Site content | dynamic sections (press / testimonials / gallery / projects / blog) are **async server components** reading Postgres via `lib/content.ts`; everything else is static JSX. `export const revalidate = 3600` + on-demand ISR (`app/api/revalidate`). | edits in the dashboard show up without a rebuild |
| Marketing animation | each site's **own original `main.js`** (CSS + one IntersectionObserver), carried over unchanged. | **No new** Lenis / GSAP on the five marketing sites. TinkerChamps keeps its existing Lenis + ScrollColorBackground. `prefers-reduced-motion` respected by the original JS. |
| Dashboard + TinkerChamps | **Next 16** (App Router) + React 19 | matches current TinkerChamps |
| Dashboard UI | **shadcn/ui** (Radix + Tailwind), **TanStack Table** for lists, **nuqs** for URL filter state | professional admin standard; every control specced in §6 |
| ORM | **Drizzle** + `postgres` (postgres.js) | connection string only — portable to a droplet later |
| Auth | **Supabase Auth** email + password (switched from Auth.js 2026-09 for managed reset emails) | `@supabase/ssr`; login has show/hide + "Forgot password"; `/reset-password`, `/auth/callback`; invite-by-email for new users; `users` table is a profile keyed by the auth uid |
| RBAC | app-level: `role` + per-vertical grants (see §5) | enforced in server actions + middleware, not Postgres RLS |
| Image storage | **Supabase Storage** now (buckets `tinkerchamps`, `walk2lead`, `shared`), public-read, service-role write. Reached only through `lib/storage.ts` (`put` / `delete` / `publicUrl`) so switching to **Cloudflare R2** later is a config + one-time file-copy job, no app changes. | gallery/press/reviews are small; 1 GB free is plenty for now. `STORAGE_PROVIDER` env flips it. |
| Cron | **GitHub Actions** scheduled workflow | `SELECT 1` + a row in `ping_log`, 4×/week |
| Hub deploys | Vercel or a single VPS (Caddy + PM2) — every app is `output: standalone` so both work identically | see §8 |
| Content → site refresh | dashboard "Publish" → `POST <SITE_URL_*>/api/revalidate` (`x-revalidate-secret: REVALIDATE_SECRET`) → `revalidatePath("/","layout")` | **no rebuild** — on-demand ISR; sidesteps the Cloudflare 500-build/mo cap |

### Libraries deliberately NOT used
Lenis, GSAP, locomotive-scroll, react-spring, AOS, particles, three.js on marketing pages,
any carousel lib with layout thrash. Keeps first load small and scrolling smooth on low-end Android.

---

## 3. Design system for the Tailwind restyle

The current sites are approved *content and structure*. The restyle keeps **all copy, all
sections, all photos, all real facts**, and each vertical's **accent colour + display font**,
but rebuilds the styling on one Tailwind foundation so the whole estate looks like one family
and the dashboard shares the same primitives.

`@delead/brand` exports:

- **Tailwind preset** — spacing scale, radius scale, shadow scale, container widths, easing tokens, one type scale.
- **Base palette** — `ink #1c1417`, `cream #faf7f4`, `cream-2 #f2e9e2`, `line #e6dcd3`, `paper #fff`, magenta `#750649` / deep `#4a0330` (house brand).
- **Per-vertical accent tokens** (unchanged from today):
  | Vertical | Accent(s) | Display font |
  |---|---|---|
  | Hub / Corporate | magenta `#750649` | Instrument Sans |
  | Walk2Lead | red `#c81c1c` | Lora (italic) |
  | TinkerChamps | purple `#5021b0` + yellow `#fdc638` | Covered By Your Grace |
  | MakerChamps | navy `#021e5d` + orange `#fe5501` + lime `#c3e86a` | Bricolage Grotesque |
  | DLI Education | navy `#142653` + teal `#29bac1` | Poppins |
  | Goal Finder (link only) | blue `#0145d5` | — |
- **Fonts** self-hosted via `@fontsource` (no render-blocking Google Fonts request; faster, no layout shift).
- **Shared primitives** (`@delead/ui` + Astro components): `Button`, `Eyebrow`, `SectionHead`, `Marquee`, `Reveal`, `StatCounter`, `Nav`, `Footer`, `EcosystemDropdown`, `LeadForm`.

### Motion budget (per page)
- Entrance reveals: 1 IntersectionObserver, `opacity`+`translateY(12px)`, 400–600 ms, `will-change` cleared after. Staggered by CSS `transition-delay` only.
- Counters: one rAF loop, runs once.
- Marquees: CSS `@keyframes translateX`, `prefers-reduced-motion` → static.
- Page transitions: Astro View Transitions, fade only.
- At most **one** island-based "flourish" per page (e.g. hero parallax on pointer move, throttled). Removed if it costs >5 ms/frame on a mid Android.

---

## 4. Database schema (`packages/db/src/schema.ts`)

Postgres, `public` schema. All ids `uuid default gen_random_uuid()`. All tables `created_at`,
`updated_at timestamptz`. `sort_order int default 0` where ordering matters.

### Auth & access
| Table | Key columns |
|---|---|
| `users` | `email` (unique, citext), `password_hash`, `name`, `role` (`super_admin` \| `staff`), `is_active`, `last_login_at` |
| `sessions` | Auth.js DB sessions — `user_id`, `session_token`, `expires` |
| `user_vertical_access` | `user_id`, `vertical` (enum), `permission` (`view` \| `edit`) — no row = no access |
| `audit_log` | `user_id`, `action`, `entity`, `entity_id`, `diff jsonb`, `created_at` — every create/update/delete/publish |

`vertical` enum: `deleadint | walk2lead | makerchamps | corporate | dli_education | tinkerchamps`.

### Leads (all six site forms)
| `leads` | `source` (vertical enum), `name`, `email`, `phone`, `interest`, `message`, `page_path`, `user_agent`, `ip_hash`, `meta jsonb`, `created_at`. **Read + filter + search + CSV only** — no status field (per client). |

### TinkerChamps (replacing Sanity)
| `tc_bookings` | parentName, studentName, classGrade, phone, place, `meta`, `created_at` (single-form set since 2026-09). Read-only list + CSV. |
| `tc_events` | title, `slug` (unique), `logo_asset_id`, description, date_str, location, audience, duration, inclusion, is_featured, is_active, sort_order, `stats jsonb` (max 4 `{icon,title,text}`) |
| `gallery_images` | `vertical`, title, `asset_id`, sort_order, is_active |
| `whatsapp_reviews` | `vertical`, title, `asset_id`, sort_order, is_active |

### Shared content (multi-vertical, dashboard-managed)
| `testimonials` | `vertical`, quote, author_name, author_role, `avatar_asset_id?`, source_note, sort_order, is_active |
| `press_clippings` | `vertical`, title, publication, date_str, `asset_id`, `link_url?`, sort_order, is_active — Walk2Lead "newspaper cuttings" + hub "Press" |
| `blog_posts` | `vertical` (or `null` = hub Journal), title, `slug` (unique), excerpt, `cover_asset_id`, `body_md`, tag, `status` (`draft`\|`published`), published_at, author_name |
| `courses` | `audience` (`students`\|`professionals`), track, title, level, description, age_label, format, duration_label, is_featured, sort_order, is_active — DLI Education catalogue |
| `w2l_projects` | title, category, description, `asset_id`, sort_order, is_active — Walk2Lead student builds |
| `site_stats` | `vertical`, `group_key`, label, value, suffix, sort_order — editable counters (hero bands, "big numbers") |
| `site_settings` | `vertical`, `key`, `value jsonb` — small toggles: e.g. MakerChamps `next_season` (`{active,label,dates,logo_asset_id}`), TinkerChamps hero copy |

### Assets & ops
| `assets` | `provider` (`supabase`\|`r2`), `bucket`, `path`, `mime`, `width`, `height`, `bytes`, `alt`, `uploaded_by` — every upload has a row so the dashboard shows a picker/library, and the row (not a hard-coded URL) is what content tables reference by `asset_id`. Public URL is derived at render from `provider`+`bucket`+`path`, so an R2 migration only rewrites `provider`/`bucket`. |
| `ping_log` | `checked_at` — cron writes here |

**Migration inputs:** current Sanity content (4 events? gallery ~18, whatsapp reviews ~2) is
exported via GROQ and imported by a one-off script in `packages/db/scripts/import-sanity.ts`
(needs the existing `SANITY_API_*` values from `Tinkerchamps/.env.local`).

---

## 5. Role-based access

Two roles, plus per-vertical grants:

- **super_admin** — full access to every vertical + can manage users/grants + see audit log. (Seeded admin, and anyone they promote.)
- **staff** — sees only the verticals they're granted, at `view` or `edit` level. No user management, no audit log, no settings outside their verticals.

**Leads** visibility follows the same grants: a staffer granted `tinkerchamps` sees only
`source = tinkerchamps` leads. super_admin sees all, with a vertical filter.

Enforcement:
1. `middleware.ts` — redirect unauthenticated → `/login`.
2. `lib/authz.ts` — `requireAccess(vertical, 'edit')` called at the top of every server action and every page loader. Returns 403 UI otherwise.
3. Nav is built from the user's grants — a staffer simply doesn't see sections they can't touch.
4. Every mutation writes `audit_log`.

**User management screen** (super_admin only): list users → row actions *Edit access* /
*Deactivate* / *Reset password*; "Invite user" = create with email + temp password (shown once,
copy button) + tick which verticals and view/edit. No email sending needed.

---

## 6. Dashboard IA — every screen and control

Standard admin pattern: left sidebar nav, top bar (search + user menu), content = either a
**list view** (table + filter bar + "New") or an **edit view** (form in a right-side sheet for
short records, full page for `blog_posts`). Toaster for save/error. Optimistic where safe.

### Global
- **Top bar:** global search (leads by name/email/phone; content by title), vertical switcher (super_admin only; filters the whole dashboard), user menu (Profile, Change password, Sign out).
- **Sidebar:** Dashboard · Leads · then a group per vertical the user can access, each expanding to its content types · (super_admin) Users · (super_admin) Audit log · (super_admin) Settings.
- **Every list view:** search box, filter chips, column sort, pagination (25/50/100), "Export CSV" (respects current filter), "New …" button (hidden if `view` only). Empty state with a one-line explainer + primary action.
- **Every edit view:** labelled fields, inline validation, `Save` / `Cancel`, `Delete` (with confirm dialog naming the record), "unsaved changes" guard on navigate. Image fields open the **Asset picker** (upload new / choose existing / set alt text / crop to aspect).
- **Publish model:** content tables have `is_active` / `status`. Saving stores the change; a per-vertical **"Publish to site"** button POSTs `<SITE_URL_*>/api/revalidate` (on-demand ISR — no rebuild, effect is near-instant). A subtle "3 unpublished changes" badge tracks drift.

### Screens

**1. Dashboard (home)** — cards: new leads (7/30 days) with a sparkline, leads by vertical (bar), latest 5 leads, "unpublished changes" per vertical, cron/last-ping health, quick links. Scoped to the user's verticals.

**2. Leads** — table: Date · Name · Vertical · Interest · Email · Phone · (expand row → message + page + UA). Filters: vertical (super_admin), interest, date range, free-text search. Row click → detail sheet (read-only, `mailto:` + `tel:` + "copy all"). Export CSV. No edit/delete (leads are a record).

**3. TinkerChamps**
   - *Events* — list (Title · Dates · Location · Featured · Active · Order). New/Edit sheet: title, slug (auto from title, editable), logo (asset), description, date_str, location, audience, duration, inclusion, `Featured` toggle, `Active` toggle (controls whether it shows in the booking selector), order (drag to reorder), **Stats** repeater (max 4: icon dropdown [calendar/book/star/bird] · value · caption). Delete with confirm.
   - *Bookings* — read-only table (Parent · Student · Class · Phone · Location · Date), CSV. Detail sheet shows all fields.
   - *Gallery* — grid of thumbnails, drag-reorder, toggle active, bulk upload, edit caption/alt, delete.
   - *WhatsApp reviews* — same grid pattern as gallery.
   - *Testimonials* — list (Quote preview · Author · Role · Active · Order). Sheet: quote (textarea), author name, author role, avatar (optional asset), source note, active, order.
   - *Hero / settings* — a few fields: hero headline, sub, CTA label, "next season" block.

**4. MakerChamps** — *Testimonials* (as above) · *Gallery* · *Settings* → **Next season** editor: `Active` toggle (when off, the site hides the hero ribbon + invite card), label ("Season 3"), dates ("Aug 28–29"), campus line, season logo (asset). *Stats* (the `#1 NIT`, `60 seats`, `7 modules` numbers).

**5. Corporate Training** — *Testimonials* (currently `[placeholder]` on the live site — dashboard is where the real ones get entered) · *Track record* editor (the dated engagement cards: when · client · blurb · badge · order) · *Stats* · *Gallery*.

**6. DLI Education** — *Courses* — list with an `audience` (Students/Professionals) filter + track filter. Sheet: audience, track, title, level (Beginner/Intermediate/All), description, age label, format, duration label, `Featured` toggle, order. · *Outcomes / student stories* (name · school · win · tag) · *Testimonials* · *Stats*.

**7. Walk2Lead** — *Newspaper cuttings* (`press_clippings`) — grid: image, title, publication, date_str, optional link, order, active. Bulk upload. · *Student projects* (`w2l_projects`) — grid/list: image, title, category chip, description, order. · *Testimonials* (the funder / DIET / parent quotes) · *Stats* (44 schools / 1,300+ / 4 districts / phases) · *Phase log* (the "reality" timeline entries).

**8. De' Lead International (hub)** — *Journal / Blog* — list (Title · Status · Published · Tag). Full-page editor: title, slug, tag, cover image, excerpt, **Markdown body** (textarea + live preview; MDX not needed), status Draft/Published, publish date, author. · *Press* · *Voices/testimonials* · *Gallery* · *Ecosystem stats* (5000+ / 1000+ / 50+) · *Directors' quote*.

**9. Users** (super_admin) — see §5.

**10. Audit log** (super_admin) — table: When · Who · Action · Entity · (diff popover). Filter by user / entity / date.

**11. Settings** (super_admin) — deploy-hook status per site, Apps Script URL check, storage usage, DB size, "run ping now".

---

## 7. Static-site ↔ data wiring

Each Next site reads its content from Postgres (via `@delead/db`) inside **async server
components** (`lib/content.ts`), cached by ISR (`revalidate = 3600`). No client-side DB calls.
Fresh content appears when:
- code is pushed (host auto-deploy), or
- the dashboard "Publish" button `POST`s `<SITE_URL_*>/api/revalidate` with
  `x-revalidate-secret: REVALIDATE_SECRET` → `revalidatePath("/", "layout")`.

Forms: every site ships a lead `<form data-lead-source="...">` + `public/js/lead-capture.js`
→ `POST {NEXT_PUBLIC_LEAD_ENDPOINT}` (the
dashboard's `/api/lead`). The endpoint:
1. validates (zod) + rate-limits (IP hash, simple in-memory + `leads` recent check),
2. `INSERT` into `leads`,
3. returns `{ ok: true }` (fast),
4. `waitUntil` → POST the payload to the Apps Script URL **for that `source`** (`APPS_SCRIPT_URL_<VERTICAL>`) — each site has its own Google Sheet + Web App. Empty var = hop skipped, lead still saved. Failure here never fails the request.

CORS on `/api/lead`: allow the six known `SITE_URL_*` origins only (plus `localhost` in dev).

---

## 7b. Storage adapter (`lib/storage.ts`)

Single interface used by the dashboard for every image:

```
put(file, { bucket, keyHint }): { provider, bucket, path, width, height, bytes, mime }
delete({ provider, bucket, path })
publicUrl({ provider, bucket, path }): string
```

- `provider = 'supabase'` → Supabase Storage SDK, `publicUrl` = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`.
- `provider = 'r2'` → S3 client to R2, `publicUrl` = `${R2_PUBLIC_BASE_URL}/${path}`.
- Next sites don't call storage — `lib/content.ts` reads `asset_id` rows and derives the public URL the same way.
- **R2 migration path (later, on client OK):** set R2 env, run `scripts/migrate-storage.ts` (copies every `assets` row's file to R2, updates `provider`/`bucket`/`path`), flip `STORAGE_PROVIDER=r2`, redeploy. No code change, no content re-entry.

---

## 8. Hosting & DNS (Hostinger DNS, Zoho mail — leave MX/TXT alone)

Supabase project region: **ap-south-1 (Mumbai)** — closest to the India/UAE audience and to
Cloudflare's Indian edges. Runtime uses the **transaction pooler** (`:6543`); migrations/seed/CI
use the **session pooler** (`:5432`) — both IPv4, required because free-tier direct `db.<ref>`
is IPv6-only and GitHub/Vercel runners are IPv4.


All seven apps are Next with `output: "standalone"` — deploy on **Vercel** (one project per
app, Root Directory `apps/<app>`) **or** a single **VPS** (`caddy` reverse-proxy by host →
`pm2`/systemd running each `node .next/standalone/.../server.js` on its own port). Same build
either way: `pnpm install && pnpm --filter <app> build`.

Per app, set env: `DATABASE_URL` (pooler), `NEXT_PUBLIC_LEAD_ENDPOINT`, `SUPABASE_URL`,
`REVALIDATE_SECRET` (same value everywhere), and its own `SITE_URL_<KEY>`. The dashboard also
needs the Supabase keys + `SITE_URL_*` for every vertical so Publish can reach them.

Custom domain per app → add the subdomain → CNAME to the host → add `CNAME` in Hostinger. SSL auto.

**DNS cutover checklist** (per host): add the CNAME, wait for SSL, verify, then only after
all green, leave the old sites up on their current hosting as fallback until the client signs off.
Do **not** modify `MX`, `TXT` (SPF/DKIM/DMARC), or `autodiscover` records — Zoho stays as-is.

---

## 9. Cron — keep Supabase awake

`.github/workflows/supabase-ping.yml`: `on.schedule` at 06:00 UTC Mon/Wed/Fri/Sun (4×/week).
Job: `node packages/db/scripts/ping.ts` → `INSERT INTO ping_log DEFAULT VALUES; SELECT count(*) FROM ping_log;`
using `DATABASE_URL` from repo secret. Also a manual `workflow_dispatch`.

---

## 10. Build order (single delivery, but internally sequenced)

1. `[~]` Scaffold: workspace, turbo, tsconfig/eslint, `@delead/brand` preset + tokens + fonts.
2. `[ ]` `@delead/db`: schema, drizzle config, `schema.sql` dump, migrations, seed (admin + verticals), `import-sanity.ts`.  ⛔ needs `DATABASE_URL`
3. `[ ]` `@delead/ui`: Button/Eyebrow/SectionHead/Marquee/Reveal/StatCounter/Nav/Footer/LeadForm.
4. `[ ]` `dashboard`: auth + middleware + authz, layout/nav, Leads, then per-vertical CRUD, Users, Audit, Settings, `/api/lead`, deploy-hook trigger.
5. `[x]` Marketing sites, in order: `deleadint` → `walk2lead` → `makerchamps` → `corporate` → `dli-education`. Each: **1:1 Astro→Next port** (verbatim css/js in `public/`, markup → `components/S*`), DB-backed sections via `lib/content.ts`, lead form + `lead-capture.js`, ISR + `/api/revalidate`.
6. `[ ]` `tinkerchamps`: swap `sanity/lib/client` reads → `@delead/db`; booking API → Postgres insert (+ keep Apps Script); delete `/studio`; images → Supabase Storage; keep all components/design.
7. `[ ]` `.github/workflows` (ping + CI).
8. `[ ]` Deploy docs per app + DNS checklist in `docs/DEPLOY.md`.

---

## 11. ⛔ Blockers — need from client

| # | Needed | Where it goes | Why |
|---|---|---|---|
| ~~B1~~ | ✅ Project `dslvxzcqcuqhfqqaohfb` ("De Lead Web", Mumbai), pw `Dli_Web_2026`. Strings in `.env`. | done | — |
| ~~B2~~ | ✅ `webdelead@gmail.com` / `DLI_site_3841`. In `.env`, seeded as `super_admin`. | done | — |
| ~~B3~~ | ✅ **Per-site** Apps Scripts (each site its own Sheet). `.env` has `APPS_SCRIPT_URL_<VERTICAL>` — URLs still to be pasted; hop is skipped (lead still saved) until then. | pending URLs | — |
| ~~B4~~ | ✅ `w2l` / `mc` / `tc` / `corporate` / `edu` / `admin` on `deleadint.com` (short forms canonical; `walk2lead`/`makerchamps`/`tinkerchamps` 301 → short). | done | — |
| ~~B5~~ | ✅ `Tinkerchamps/.env.local` has project `4y4755by`, dataset `production`, + a **write token** (`sk…`) that also grants read — enough for a one-time GROQ export. Will use read-only. | done | — |
| ~~B6~~ | ✅ `webdelead/De-Lead-Web` created empty. `git init` + remote set here. | done | — |
| ~~B7~~ | ✅ **Launch with posts.** Blog section visible; I draft 3 real starter posts (one per key vertical) from existing brochure facts, flagged for client edit. | done | — |

With B1 provided, I can build and migrate the real schema immediately. B2–B3 only gate the
admin seed and the Sheet-backup hop; both are safely stubbed until you supply them.

### Deferred (post-launch, on client confirmation)
- **Cloudflare R2** for image storage — adapter + migration script built now, switched later by env.
- Wiring the enquiry **form** submissions into anything beyond `leads` + Apps Script.
- ~~Framework migration of the Astro sites~~ — **done** (Astro → Next 15, 2026-09), for on-demand ISR + shared React components.
