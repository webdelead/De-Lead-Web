import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import { config } from "dotenv";
import { resolve } from "node:path";

// load monorepo-root .env for build-time DB access
config({ path: resolve(process.cwd(), "../../.env") });

export default defineConfig({
  site: process.env.SITE_URL_DELEADINT || "https://deleadint.com",
  output: "static",
  vite: {
    plugins: [tailwind()],
    ssr: { noExternal: ["@delead/ui", "@delead/brand"] },
  },
  build: { inlineStylesheets: "auto" },
});
