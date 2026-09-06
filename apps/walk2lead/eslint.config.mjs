import { globalIgnores } from "eslint/config";
import base from "@delead/config/eslint.config.base.mjs";

/**
 * Frozen `public/**` (verbatim main.js / styles.css) is not linted, and the
 * mechanically html2jsx-split components trip two rules that this site's
 * Tailwind migration resolves wholesale. Delete the `rules` block (and tighten
 * to `error`) on the `redesign/<site>` branch — see
 * docs/MIGRATION-CSS-TO-TAILWIND.md.
 */
const config = [
  ...base,
  globalIgnores(["public/**"]),
  {
    rules: {
      "react/no-unescaped-entities": "warn",
      "@next/next/no-html-link-for-pages": "warn",
    },
  },
];

export default config;
