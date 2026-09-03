import { defineConfig } from "astro/config";
import { resolve } from "node:path";

// static, exact port of the client-approved design. No Tailwind, no shared UI —
// each site keeps its own original css/styles.css + js/main.js (in public/).
export default defineConfig({
  output: "static",
  envDir: resolve(process.cwd(), "../.."),
  build: { assets: "_astro" },
  devToolbar: { enabled: false },
});
