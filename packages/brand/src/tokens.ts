/** Raw brand token values for JS/TS consumers (dashboard charts, OG images, etc.). */
export const palette = {
  ink: "#1c1417",
  inkSoft: "#4d4348",
  cream: "#faf7f4",
  cream2: "#f2e9e2",
  line: "#e6dcd3",
  paper: "#ffffff",
  magenta: "#750649",
  magentaDeep: "#4a0330",
  magentaSoft: "#9c2e73",
  w2l: "#c81c1c",
  tcPurple: "#5021b0",
  tcYellow: "#fdc638",
  mcNavy: "#021e5d",
  mcOrange: "#fe5501",
  mcLime: "#c3e86a",
  dliNavy: "#142653",
  dliTeal: "#29bac1",
  gfBlue: "#0145d5",
} as const;

export type PaletteKey = keyof typeof palette;
