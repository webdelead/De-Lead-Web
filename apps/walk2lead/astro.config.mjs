import { defineConfig } from "astro/config";
import tailwind from "@tailwindcss/vite";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../../.env") });

export default defineConfig({
  site: process.env.SITE_URL_WALK2LEAD || "https://w2l.deleadint.com",
  output: "static",
  vite: {
    plugins: [tailwind()],
    ssr: { noExternal: ["@delead/ui", "@delead/brand"] },
  },
  build: { inlineStylesheets: "auto" },
});
