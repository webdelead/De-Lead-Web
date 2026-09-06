import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Shared flat ESLint config for every app (extracted from the one TinkerChamps
 * had). An app's own eslint.config.mjs spreads this and appends its own
 * globalIgnores() — the five marketing sites ignore `public/**` (the frozen
 * verbatim main.js / styles.css must not be linted) until they migrate.
 */
const config = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // dead Astro-era codegen — the sites are Next now; tsconfig already excludes it
    ".astro/**",
  ]),
  {
    rules: {
      // eslint-plugin-react-hooks v6 shipped new "React Compiler" rules with the
      // Next 16 upgrade. They fire on pre-existing, previously-clean code across
      // the dashboard + TC. Keep as warnings until a dedicated correctness pass;
      // promote to "error" after. (Not migration churn — a real backlog.)
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default config;
