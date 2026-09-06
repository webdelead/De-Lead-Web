# Migration plan — verbatim CSS/JS → Tailwind + React components

Status: **not started.** This is the agreed plan for moving the 5 marketing sites off
their frozen legacy stylesheets/scripts. Do it on its own branch, one site at a time.

---

## Where things stand today (the thing being migrated)

`apps/deleadint · walk2lead · makerchamps · corporate · dli-education` are **1:1 pixel
ports** of client-approved static sites:

- Each app's original `css/styles.css` + `js/main.js` were copied **verbatim** into
  `apps/<name>/public/` and are loaded as plain `<link>` / `<script>` tags from the
  root `layout.tsx`. ~182 KB CSS + ~49 KB JS across the five, unminified, global.
- Only the **markup** was componentised — `components/S01_*…SNN_*`, split mechanically
  by `scripts/html2jsx.mjs`. Sections are static JSX except the DB-backed ones
  (`lib/content.ts`, async server components, ISR `revalidate = 3600`).
- Fonts load via a render-blocking `<link>` to Google Fonts (deleadint: 8 families;
  others 1–3). See the font table at the bottom.
- `public/js/lead-capture.js` — one canonical copy in
  `packages/shared/browser/lead-capture.js`, synced into each app by
  `pnpm sync:lead-capture` (CI checks drift).

`apps/tinkerchamps` is **already built the target way** — React + Tailwind v4
(`@delead/brand` tokens) + framer-motion / Lenis / OGL as client components, no
`styles.css`. Use it as the reference for how a migrated marketing site should look
structurally.

### Repo baseline this plan builds on (branch `audit-fixes`, merge to `main` first)

- All 7 apps on **Next 16.3.4 / React 19.2.8** (pnpm catalog, exact pins).
- `output: "standalone"` removed from all configs (Next 16 + Vercel incompat).
- Security headers via `@delead/shared/headers` `securityHeaders()` — **no CSP yet**
  (the verbatim inline JS/handlers block it; CSP becomes possible once a site is
  migrated).
- `buildSafe()` fails the production build on a DB read error
  (`BUILD_ALLOW_DB_FALLBACK=1` only in CI).
- `pnpm audit --audit-level=high` is a blocking CI gate.
- ESLint: only TinkerChamps has a real `eslint` flat config + `lint` script. The
  other 6 have none (`next lint` was removed in Next 16). Flat-config rollout is part
  of this migration's shared prep.

---

## Goal / non-goals

**Goal:** each marketing site rendered from Tailwind utilities + `@delead/brand` tokens
+ React components, with `styles.css` / `main.js` / the Google `<link>` deleted.
Same pixels, better maintainability, and CSP / `next/image` / `next/font` become
feasible.

**Non-goals (do not do these here):**
- No redesign. Pixel parity first — visual changes are a separate client conversation.
- No new animation libraries on the 5 sites (TC keeps its own).
- Don't unify font *choices* across sites to cut the family count — each site's fonts
  are its approved identity.

---

## Branch & workflow

**No long-lived `v2` branch.** Each `apps/<name>` is an independent package with its
own Vercel project — rewriting one can't break another. So:

1. Branch from `main` per site: `redesign/<site>` (e.g. `redesign/corporate`).
2. Migrate that one site, PR into `main`, merge when the visual gate is green **and**
   the client signs off. `main` stays live throughout — the other 4 sites are
   untouched.
3. Hotfixes land on `main` as normal. An open `redesign/*` branch just
   `git rebase main` (short-lived, private → rebase is fine).
4. Shared `packages/*` changes (see prep) land on `main` first; rebase topic branches
   onto them.

Use a long-lived branch **only** if the client wants all 5 staged for review before
any go live — then `merge main → v2` periodically (never rebase a shared branch), one
cutover at the end.

---

## Shared prep (once, before the first site) — its own branch `redesign/prep`

1. **Design tokens → `packages/brand`.** Extract every color / spacing / radius /
   shadow / font stack from the 5 `styles.css` files into the Tailwind v4 theme
   (`@theme`). Per-vertical accent tokens already exist (`--tc-*`, `--w2l-red`,
   `--mc-*`, magenta `#750649`, ink `#1c1417`, cream `#faf7f4`). This is the target
   styling vocabulary.
2. **`packages/fonts`** — self-hosted `next/font/local` loaders, one per family, woff2
   held once. Each app imports only what it uses. Kills the render-blocking Google
   `<link>`, the GDPR exposure, and the hermetic-build problem
   (`next/font/google` needs network at build). deleadint already trimmed 2 unused
   families (Host Grotesk, Baloo 2) — see table below for the rest.
3. **Grow `packages/ui`** with the primitives `main.js` currently does imperatively:
   - `<Reveal>` / `useReveal` — the IntersectionObserver scroll-reveal (`.reveal`,
     `.reveal-stagger`).
   - `<Counter>` — the `data-count` / `data-suffix` number roll.
   - nav / mobile-menu / dropdown — React state (deleadint's ecosystem dropdown is
     the most complex: hover on desktop, tap on mobile, 6 verticals + logos).
   - a carousel / marquee / accordion as sites need them.
   - Already there: `<ScrollStack>` (`./scroll-stack`).
4. **Visual-regression harness** (the gate that makes "pixel-perfect" verifiable):
   Playwright screenshots of the current frozen site — every section, at mobile /
   tablet / desktop — as the baseline; after the rewrite assert the new build matches
   within a small threshold. `apps/<site>/e2e/visual.spec.ts`, run in CI on
   `redesign/*`. Set up once, reused for all 5. **Note: does not cover motion** —
   interactive parity (carousels, scroll-stack, nav) still needs manual QA.
5. **ESLint flat config per app** — copy TinkerChamps' `eslint.config.mjs` +
   `eslint` / `eslint-config-next` devDeps + `"lint": "eslint"` script to the other 6.
   Then flip CI `lint` from `continue-on-error` to blocking. (Clearing TC's ~12
   existing lint errors is part of this.)

---

## Per-site playbook

Order (easiest first, most interactive last):
**walk2lead** or **corporate** (single stylesheet, 1–2 fonts) → **makerchamps** →
**dli-education** → **deleadint** last (VStack ecosystem cards with per-card display
fonts, VoicesCarousel coverflow, ScrollStack — all custom interactive components).

For each site:

1. Capture the Playwright baseline from the current frozen build.
2. Section by section (`S01…SNN`): global classNames → Tailwind utilities +
   `@delead/brand` tokens. Replace that section's `main.js` behavior with the
   `@delead/ui` primitive or local React state.
3. `<img>` → `next/image` with explicit width/height (safe now — you're rewriting the
   section and the screenshot gate catches drift). Reserve dimensions to kill CLS.
4. Fonts → `packages/fonts` / `next/font/local`; delete the Google `<link>`.
5. When the last section is done: delete `apps/<name>/public/css/styles.css`,
   `public/js/main.js`, and `public/js/lead-capture.js`; drop that app from
   `scripts/sync-lead-capture.mjs`'s `APPS` list; move lead capture to a shared
   client component / hook.
6. Turn on a real CSP for that app (no more unhashed inline handlers) — start
   `Content-Security-Policy-Report-Only`, then enforce.
7. Visual gate green → manual interaction QA → client review → merge to `main`.

---

## Effort (rough)

| | |
|---|---|
| Shared prep (tokens, fonts, ui primitives, visual harness, ESLint) | ~2–3 days |
| Pilot site (walk2lead / corporate) | ~1–2 days |
| makerchamps, dli-education | ~1–2 days each |
| deleadint (custom interactive components) | ~3–4 days |

~2 weeks focused + client review cycles. Sites ship independently as they're ready.

## Risks

- **Interactive parity** — the screenshot gate is static; carousels / scroll-stack /
  nav need manual QA per breakpoint.
- **`packages/*` churn** while multiple `redesign/*` branches are open — land shared
  changes first, rebase topic branches.
- **Scope creep** — resist "improving" the design mid-migration.
- **deleadint `Voices`** already diverged from its static folder on purpose (client-
  directed coverflow) — don't diff that section against `../De Lead International/`.

---

## Font inventory (as of 2026-09)

| App | Families | Loader |
|---|---|---|
| deleadint | Instrument Sans, Inter, Lora, Caveat, Covered By Your Grace, Bricolage Grotesque, Space Grotesk, Manrope | `<link>` css2 (Host Grotesk + Baloo 2 already removed as unused) |
| walk2lead | Lora, Inter | `<link>` css2 |
| makerchamps | Bricolage Grotesque, Anton, Inter | `<link>` css2 |
| corporate | Instrument Sans, Inter | `<link>` css2 |
| dli-education | Poppins | `<link>` css2 |
| tinkerchamps | Host Grotesk, Covered By Your Grace | `next/font/google` |
| dashboard | Inter | `next/font/google` |

11 distinct families. Overlap: Inter (5 apps), Lora / Instrument Sans / Bricolage
Grotesque / Covered By Your Grace / Host Grotesk (2 each). "Combining" = one shared
`packages/fonts` source + loader, **not** shared font choices and **not** one runtime
download (separate deployments each ship their own files).

---

## Also deferred from the same audit (not blockers, plan alongside)

- Full `next/image` migration beyond heroes; convert remaining PNG/JPEG → WebP/AVIF;
  the ~5.7 MB TinkerChamps testimonial video.
- Minify the legacy CSS/JS *if* a site isn't migrated yet (interim only).
- `@supabase/supabase-js` and other minors — keep current via the catalog.
