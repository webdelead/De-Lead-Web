# @delead/fonts

Self-hosted `next/font/local` loaders for every family the five marketing sites
use. Replaces the render-blocking `<link href="fonts.googleapis.com/css2?…">` in
each app's `layout.tsx`.

**Why**

- Hermetic build — `next/font/google` fetches from Google at build time; this
  doesn't.
- No `fonts.gstatic.com` request from the visitor's browser (GDPR) and no
  render-blocking stylesheet.
- `next/font` injects fallback-metric overrides → no font-swap layout shift.
- One vendored copy of each face (`files/*.woff2`), tree-shaken per app.

## Use

Add to the app that needs it:

```jsonc
// apps/<site>/package.json
"dependencies": { "@delead/fonts": "workspace:*" }
```

```ts
// apps/<site>/next.config.ts
transpilePackages: [/* … */, "@delead/fonts"],
```

```tsx
// apps/<site>/app/layout.tsx  — walk2lead example
import { lora } from "@delead/fonts/lora";
import { inter } from "@delead/fonts/inter";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-vertical="walk2lead" className={`${lora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`*.variable` sets the CSS custom property `@delead/brand/theme.css` expects
(`--font-lora`, `--font-inter`, …), so `--font-display` / `--font-sans` resolve
without any extra wiring. Delete the Google `<link>` and its two `<link
rel="preconnect">` tags in the same edit.

**Import the exact subpath — never a barrel.** `import { lora } from
"@delead/fonts/lora"`. Importing `@delead/fonts` (the doc-only `index.ts`) would
make `next/font` bundle all ~17 faces into the app.

### Family → subpath

| Subpath | Export | Weights (latin only) | Sites |
|---|---|---|---|
| `@delead/fonts/inter` | `inter` | variable 400–800 | deleadint, walk2lead, makerchamps, corporate |
| `@delead/fonts/instrument-sans` | `instrumentSans` | variable 400–700, +italic | deleadint, corporate |
| `@delead/fonts/lora` | `lora` | variable 400–700, +italic | deleadint, walk2lead |
| `@delead/fonts/caveat` | `caveat` | variable 400–700 | deleadint |
| `@delead/fonts/covered-by-your-grace` | `coveredByYourGrace` | 400 | deleadint |
| `@delead/fonts/bricolage-grotesque` | `bricolageGrotesque` | variable 400–800 | deleadint, makerchamps |
| `@delead/fonts/space-grotesk` | `spaceGrotesk` | variable 400–700 | deleadint |
| `@delead/fonts/manrope` | `manrope` | variable 400–800 | deleadint |
| `@delead/fonts/anton` | `anton` | 400 | makerchamps |
| `@delead/fonts/poppins` | `poppins` | 300/400/500/600/700/800 | dli-education |

## Regenerate

`src/*.ts` and `files/*.woff2` are generated. Edit the `FAMILIES` table in
`scripts/pull-fonts.mjs`, then:

```bash
pnpm --filter @delead/fonts pull
```

Only the `latin` subset is vendored — every visible string on the five sites is
Latin-1, and `next/font/local` has no per-`src` `unicode-range`. Add another
subset only if a site starts rendering glyphs outside it.

## CSP

Self-hosting means a future `Content-Security-Policy` for these apps needs only
`font-src 'self'` — no `fonts.gstatic.com`, no `style-src fonts.googleapis.com`.
