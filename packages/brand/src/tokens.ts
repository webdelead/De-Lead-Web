/** Raw brand token values for JS/TS consumers (dashboard charts, OG images, etc.).
 *  Mirrors packages/brand/theme.css — reconciled against the five frozen
 *  marketing stylesheets. Keep the two in sync. */

/** House palette — hub (deleadint) + corporate carry De' Lead's magenta identity. */
export const palette = {
  ink: "#1c1417",
  ink2: "#25191f",
  inkSoft: "#4d4348",
  inkFaint: "#8a7d83",
  cream: "#faf7f4",
  cream2: "#f2e9e2",
  line: "#e6dcd3",
  paper: "#ffffff",
  magenta: "#750649",
  magentaDeep: "#4a0330",
  magentaSoft: "#9c2e73",
} as const;

/** Walk2Lead — from apps/walk2lead .../styles.css (old `--red*` names). */
export const w2l = {
  base: "#c81c1c",
  deep: "#9e1414",
  bright: "#ff0000",
  wash: "#6f2622",
  ink: "#221e21",
  inkSoft: "#4c454a",
  cream2: "#f3ece6",
  magentaDeep: "#560335",
} as const;

/** MakerChamps — from apps/makerchamps/public/css/styles.css. */
export const mc = {
  navy: "#021e5d",
  navyDeep: "#010f30",
  orange: "#fe5501",
  lime: "#bed80a",
  purple: "#51238f",
  cream: "#f7f7f7",
  creamWarm: "#fdf3e7",
  ink: "#0a0a0a",
} as const;

/** DLI Education — "Whizkid": warm cream + coral + pastels.
 *  The shipped site is coral/Poppins, not the older navy/teal "CourseGenZ" idea. */
export const dli = {
  bg: "#f4efe3",
  butter: "#f3f0d2",
  ink: "#1d1d24",
  inkSoft: "#6a6a75",
  line: "#e7e1d2",
  coral: "#f4501e",
  coralInk: "#c73c12",
  lime: "#dcf34a",
  limeSoft: "#eef8bb",
  lav: "#cec1f2",
  lavSoft: "#e6dffa",
  peach: "#f6cda6",
  peachSoft: "#fbe6d2",
  rose: "#f6bfae",
  roseSoft: "#fbdcd3",
  teal: "#a7e7e0",
  tealSoft: "#dbf4f1",
} as const;

/** TinkerChamps — its live site primary + secondary (also used on the hub). */
export const tc = {
  purple: "#5021b0",
  yellow: "#fdc638",
} as const;

/** Hub-only ecosystem-card chip accents (deleadint VStack + nav dropdown).
 *  Deliberately differ from the live sub-sites' exact values. */
export const hubEcosystem = {
  mcNavy: "#0d1b3e",
  mcOrange: "#ff5a1f",
  dliBlue: "#2451c4",
  dliTeal: "#0f9488",
  gfIndigo: "#4338ca",
} as const;

/** The brand action colour + its text colour per vertical
 *  (mirrors the [data-vertical] --accent / --accent-ink in theme.css). */
export const accent = {
  deleadint: { color: "#750649", ink: "#ffffff" },
  corporate: { color: "#750649", ink: "#ffffff" },
  walk2lead: { color: "#c81c1c", ink: "#ffffff" },
  makerchamps: { color: "#fe5501", ink: "#ffffff" },
  "dli-education": { color: "#f4501e", ink: "#ffffff" },
  tinkerchamps: { color: "#5021b0", ink: "#ffffff" },
} as const;

export const radius = {
  xs: "10px",
  sm: "12px",
  md: "16px",
  lg: "22px",
  xl: "28px",
  "2xl": "36px",
  pill: "999px",
} as const;

export const shadow = {
  sm: "0 12px 34px -16px rgba(28, 20, 23, 0.24)",
  md: "0 30px 70px -30px rgba(28, 20, 23, 0.32)",
} as const;

export const font = {
  inter: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
  instrument: '"Instrument Sans", system-ui, sans-serif',
  lora: '"Lora", Georgia, serif',
  caveat: '"Caveat", cursive',
  grace: '"Covered By Your Grace", cursive',
  bricolage: '"Bricolage Grotesque", "Segoe UI", system-ui, sans-serif',
  spaceGrotesk: '"Space Grotesk", system-ui, sans-serif',
  manrope: '"Manrope", system-ui, sans-serif',
  anton: '"Anton", "Segoe UI", system-ui, sans-serif',
  poppins: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

export const containerSite = {
  deleadint: "1240px",
  corporate: "1200px",
  walk2lead: "1180px",
  makerchamps: "1180px",
  "dli-education": "1200px",
} as const;

export type PaletteKey = keyof typeof palette;
