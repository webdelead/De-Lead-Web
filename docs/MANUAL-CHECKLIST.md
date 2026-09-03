# Manual checklist — things only you can do

Console / infra / QA steps that the phase branches **can't** do in code. Work through
this once all phases are merged. Grouped by the phase that added the item.

---

## Phase 1 (branch `phase-1-security-hardening`, commit `3942aeb`)

- [ ] After merge, confirm **CI is green** (it was red before — duplicate pnpm version, now fixed).
- [ ] Dashboard Vercel env: set `CRON_SECRET` (any long random string). Optional today
      (route is soft-guarded), will be made mandatory later.

## Phase 2 (commit `1a36e2c`)

- [ ] `pnpm --filter @delead/db migrate` — applies migration `0002` (the `outbox` table).
- [ ] **RO/APP DB roles**: set `DELEAD_WEB_RO_PASSWORD` + `DELEAD_WEB_APP_PASSWORD` in `.env`,
      run `pnpm --filter @delead/db roles`. Then build the two connection strings
      (`DATABASE_URL` → `delead_web_app`, `DATABASE_URL_RO` → `delead_web_ro`) and set them
      in **each app's** Vercel env. See `docs/DEPLOY.md` §5a.
- [ ] New workflow `.github/workflows/outbox.yml`: confirm the `DIRECT_URL` repo secret exists
      (same as the other workflows), then run it once via *Run workflow* — expect `picked 0`.
- [ ] **Cloudflare Turnstile**: create a widget for `deleadint.com` + subdomains. Set
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (all site apps + dashboard) and `TURNSTILE_SECRET_KEY`
      (dashboard + tinkerchamps). Add the widget to each form and POST its token as
      `turnstileToken`. **Needs pixel-freeze sign-off** before editing `apps/*/public` markup.
      Once forms send a token, set `TURNSTILE_ENFORCE=true`.
- [ ] **Supabase Auth** (dashboard → Authentication): turn on leaked-password protection;
      enable CAPTCHA on auth endpoints; set Redirect URLs allow-list to the exact
      `admin.deleadint.com/auth/callback` + `/reset-password`; shorten JWT / session expiry.
      MFA/TOTP is deferred by decision.
- [ ] (future, droplet only) set up `pg_dump` cron + off-box copy — Supabase's daily backups
      go away the day Postgres moves off Supabase.

## Phase 3 (this branch)

- [ ] **Vercel: bump each project's Node version to 24** (Project → Settings → Node.js Version).
      Local `.nvmrc` + CI are already on 24; `engines.node` is now `>=24`.
- [ ] GitHub → Settings → Code security: confirm **Dependabot** is enabled (config added at
      `.github/dependabot.yml` — weekly minor/patch PRs, majors ignored).
- [ ] CI now runs `typecheck` (blocking) + `lint` (non-blocking) + `pnpm audit` + `build`.
      After merge, check the run is green; skim the audit output for anything real.
- [ ] Lib bumps landed: `drizzle-orm` 0.38→0.45, `drizzle-kit`→0.31, `@supabase/ssr` 0.5→0.12,
      `@supabase/supabase-js`→2.114, `marked` 15→18, `@studio-freight/lenis`→`lenis` 1.3,
      `@types/node`→24. Builds + typecheck pass. **Smoke-test after deploy**: dashboard login
      (supabase/ssr), a lead + a booking (drizzle/outbox), a journal page (marked),
      TinkerChamps smooth-scroll (lenis).
- [ ] **Deferred — Phase 3b (its own branch + QA):** Next 15→16 + React 19.0→19.2 for the
      5 sites + dashboard (TinkerChamps is already on 16). Includes `next lint` → flat ESLint
      config across all apps, and folding `next`/`react` into the pnpm catalog. **Requires
      visual diff of each marketing site against its `../<Name>` static folder** — pixel-frozen.
- [ ] **Deferred:** `zod` 3→4 (breaking; small migration) — do with Phase 4.

## Phase 4 (this branch)

- [ ] Nothing infra-only here — it's mostly code. After merge, smoke-test: dashboard
      login + a lead + a booking + a journal page still work; "Last login" in Users now
      populates; drag-reorder still saves.
- [ ] CSP added to the dashboard (enforced, conservative). If the admin UI shows blank
      panels / blocked requests, check the browser console for CSP violations and widen the
      directive in `apps/dashboard/next.config.ts`.
- [ ] `zod` bumped 3 → 4 (only `/api/lead` uses it; build + schema tests pass). No action
      unless a lead submission starts 422-ing.
- [ ] **Deferred — Phase 4b:** the journal **block / rich-text editor** (TipTap). Still a
      raw-Markdown textarea + DOMPurify. Needs: `blog_posts.body_md` → `body_json` migration,
      a dashboard editor component, a server renderer, and a one-off convert of existing posts.
- [ ] **Deferred:** decide `assets.width` / `assets.height` — populate on upload (adds `sharp`)
      or drop the columns. Currently unused, left as-is.
- [ ] Marketing-site CSP (report-only → enforce) — deferred to Phase 4b; needs per-site
      testing (Google Fonts, external images) against the frozen designs.

## Phase 5

_(to be filled in)_
