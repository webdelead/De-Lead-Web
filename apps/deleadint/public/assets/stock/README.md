# `assets/stock/`

Decorative photography referenced **directly in code** (`<img src="/assets/stock/...">`)
by components that are static, not dashboard-managed. This is NOT the same thing as the
"Gallery" section on the homepage — that one is fully database-driven (`gallery_images`
table, edited via the dashboard, served from Supabase Storage through `getGallery()` in
`lib/content.ts`). This folder used to be named `gallery/`, which caused exactly that
confusion — a hardcoded old version of `components/Gallery.tsx` pointed straight at these
files instead of the database. Renamed 2026-09 when that got fixed; 8 files that were only
ever used by that old hardcoded array were deleted at the same time (they're still fine —
the DB/Storage copies serve the real Gallery section).

Every file left here is referenced by name, on purpose. Before deleting or renaming one,
grep first: `grep -rn "stock/<filename>" apps/deleadint --include="*.tsx" --include="*.css"`.

| File | Used by |
|---|---|
| `mc-hero.webp` | `Hero.tsx` (MakerChamps polaroid) · `Nav.tsx` (ecosystem dropdown default preview) |
| `w2l-hero.webp` | `Hero.tsx` (Walk2Lead polaroid) |
| `corp-2.webp` | `Hero.tsx` (Corporate Training polaroid) · `Nav.tsx` (Corporate Training preview) |
| `tc-1.webp` | `Hero.tsx` (TinkerChamps polaroid) · `Nav.tsx` (TinkerChamps preview) |
| `mc-1.webp` | `Nav.tsx` (MakerChamps preview) · `VStack.tsx` (About section photo) · `Journal.tsx` / `app/journal/*` (fallback cover for MakerChamps-tagged posts) |
| `dli-1.webp` | `Nav.tsx` (DLI Education preview) |
| `w2l-1.webp` | `Nav.tsx` (Walk2Lead preview) · `public/css/styles.css` (`.jr-hero::before` — journal index hero background) |
| `corp-suit.webp` | `VStack.tsx` (About section photo) |
| `dli-2.webp` | `VStack.tsx` (About section photo) · `Journal.tsx` / `app/journal/*` (fallback cover for DLI Education-tagged posts) |
| `tc-4.webp` | `Journal.tsx` / `app/journal/*` (fallback cover for TinkerChamps-tagged posts, and the default fallback when a tag doesn't match) |

If a post's `cover_asset_id` is set in the dashboard, that DB-driven image wins over these
fallbacks — these only show when a journal post has no cover image assigned.
