import "react";

// The static markup sets CSS custom properties inline; allow them on style objects.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
