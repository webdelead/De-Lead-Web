/**
 * Pull the exact woff2 faces the five marketing sites need from the Google
 * Fonts CSS2 API, vendored into ./files, and (re)generate the per-family
 * next/font/local loaders in ../src.
 *
 * Run once (and again only when the FAMILIES table below changes):
 *   pnpm --filter @delead/fonts pull
 *
 * Why vendored woff2 + next/font/local (not next/font/google, not a <link>):
 *   - hermetic build (next/font/google needs network at build time)
 *   - no fonts.gstatic.com runtime hit (GDPR) and no render-blocking <link>
 *   - next/font computes fallback-metric overrides -> no font-swap CLS
 *
 * Subset: `latin` only. Every visible string on all five sites is Latin-1;
 * latin-ext / cyrillic / greek faces are intentionally skipped so each
 * weight/style is a single file (next/font/local has no per-src unicode-range).
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILES = resolve(HERE, "../files");
const SRC = resolve(HERE, "../src");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * spec  — the `family=` value passed to css2 (weights/axes we actually use,
 *         unioned across the sites that share the family).
 * varRange — when set, the face is a single variable file; becomes the
 *            next/font `weight` string (e.g. "400 800").
 * italic  — also pull the italic face.
 * fallback — next/font fallback stack (matches the frozen CSS font-family).
 * cssVar  — the CSS custom property @delead/brand/theme.css expects.
 */
const FAMILIES = [
  {
    slug: "inter",
    family: "Inter",
    spec: "Inter:wght@400..800",
    varRange: "400 800",
    cssVar: "--font-inter",
    fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  },
  {
    slug: "instrument-sans",
    family: "Instrument Sans",
    spec: "Instrument+Sans:ital,wght@0,400..700;1,400..700",
    varRange: "400 700",
    italic: true,
    cssVar: "--font-instrument",
    fallback: ["system-ui", "sans-serif"],
  },
  {
    slug: "lora",
    family: "Lora",
    spec: "Lora:ital,wght@0,400..700;1,400..700",
    varRange: "400 700",
    italic: true,
    cssVar: "--font-lora",
    fallback: ["Georgia", "serif"],
  },
  {
    slug: "caveat",
    family: "Caveat",
    spec: "Caveat:wght@400..700",
    varRange: "400 700",
    cssVar: "--font-caveat",
    fallback: ["cursive"],
  },
  {
    slug: "covered-by-your-grace",
    family: "Covered By Your Grace",
    spec: "Covered+By+Your+Grace",
    cssVar: "--font-grace",
    fallback: ["cursive"],
  },
  {
    slug: "bricolage-grotesque",
    family: "Bricolage Grotesque",
    spec: "Bricolage+Grotesque:opsz,wght@12..96,400..800",
    varRange: "400 800",
    cssVar: "--font-bricolage",
    fallback: ["Segoe UI", "system-ui", "sans-serif"],
  },
  {
    slug: "space-grotesk",
    family: "Space Grotesk",
    spec: "Space+Grotesk:wght@400..700",
    varRange: "400 700",
    cssVar: "--font-space-grotesk",
    fallback: ["system-ui", "sans-serif"],
  },
  {
    slug: "manrope",
    family: "Manrope",
    spec: "Manrope:wght@400..800",
    varRange: "400 800",
    cssVar: "--font-manrope",
    fallback: ["system-ui", "sans-serif"],
  },
  {
    slug: "anton",
    family: "Anton",
    spec: "Anton",
    cssVar: "--font-anton",
    fallback: ["Segoe UI", "system-ui", "sans-serif"],
  },
  {
    slug: "poppins",
    family: "Poppins",
    spec: "Poppins:wght@300;400;500;600;700;800",
    cssVar: "--font-poppins",
    fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  },
];

/** Parse a css2 stylesheet into { subset, style, weight, url } face records. */
function parseFaces(css) {
  const faces = [];
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g;
  let m;
  while ((m = re.exec(css))) {
    const subset = m[1];
    const body = m[2];
    const style = /font-style:\s*italic/.test(body) ? "italic" : "normal";
    const weight = (body.match(/font-weight:\s*([^;]+);/)?.[1] || "400").trim();
    const url = body.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (url) faces.push({ subset, style, weight, url });
  }
  return faces;
}

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return r.text();
}
async function fetchBuf(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const tsFallback = (arr) => arr.map((f) => JSON.stringify(f)).join(", ");

function loaderSource(fam, entries) {
  // entries: [{ file, weight, style }]
  const src =
    entries.length === 1 && !fam.italic
      ? JSON.stringify(`../files/${entries[0].file}`)
      : "[\n" +
        entries
          .map(
            (e) =>
              `    { path: "../files/${e.file}", weight: ${JSON.stringify(
                e.weight,
              )}, style: ${JSON.stringify(e.style)} },`,
          )
          .join("\n") +
        "\n  ]";
  return `// GENERATED by scripts/pull-fonts.mjs — do not edit by hand.
import localFont from "next/font/local";

/** ${fam.family} — self-hosted (latin). CSS var ${fam.cssVar}. */
export const ${camel(fam.slug)} = localFont({
  src: ${src},
  display: "swap",
  variable: "${fam.cssVar}",
  fallback: [${tsFallback(fam.fallback)}],
  preload: true,
});
`;
}

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

async function main() {
  await rm(FILES, { recursive: true, force: true });
  await mkdir(FILES, { recursive: true });
  // No barrel: an app must import the exact subpath it needs
  //   import { lora, inter } from "@delead/fonts/lora"   // ✗ wrong shape
  //   import { lora } from "@delead/fonts/lora"          // ✓
  // so next/font only ever bundles that app's own faces. index.ts is
  // documentation only — importing it would instantiate every loader.
  const indexLines = [
    "// GENERATED by scripts/pull-fonts.mjs — do not edit by hand.",
    "//",
    "// Import the per-family subpath, NEVER this file:",
    "//   import { lora } from \"@delead/fonts/lora\";",
    "// Importing a barrel here would make next/font bundle all ~17 faces",
    "// into every app. Available families:",
    "",
  ];

  for (const fam of FAMILIES) {
    const css = await fetchText(
      `https://fonts.googleapis.com/css2?family=${fam.spec}&display=swap`,
    );
    const faces = parseFaces(css).filter((f) => f.subset === "latin");
    if (!faces.length) throw new Error(`${fam.family}: no latin face found`);

    const entries = [];
    if (fam.varRange) {
      for (const style of fam.italic ? ["normal", "italic"] : ["normal"]) {
        const face = faces.find((f) => f.style === style);
        if (!face) throw new Error(`${fam.family}: missing ${style} face`);
        const file = `${fam.slug}${style === "italic" ? "-italic" : ""}.woff2`;
        await writeFile(resolve(FILES, file), await fetchBuf(face.url));
        entries.push({ file, weight: fam.varRange, style });
      }
    } else {
      // static — one file per weight
      for (const face of faces.filter((f) => f.style === "normal")) {
        const file = `${fam.slug}-${face.weight}.woff2`;
        await writeFile(resolve(FILES, file), await fetchBuf(face.url));
        entries.push({ file, weight: face.weight, style: "normal" });
      }
    }

    await writeFile(resolve(SRC, `${fam.slug}.ts`), loaderSource(fam, entries));
    indexLines.push(`//   ${fam.slug}  ->  export { ${camel(fam.slug)} }`);
    console.log(
      `${fam.family.padEnd(22)} ${entries.length} file(s): ${entries
        .map((e) => e.file)
        .join(", ")}`,
    );
  }

  await writeFile(resolve(SRC, "index.ts"), indexLines.join("\n") + "\n");
  console.log("\nwrote packages/fonts/src/*.ts + files/*.woff2");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
