/* Regenerates packages/db/schema.sql from src/schema.ts (via drizzle-kit export).
 * Run after any schema change:  pnpm --filter @delead/db schema  */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ddl = execSync("pnpm exec drizzle-kit export --sql", {
  cwd: resolve(import.meta.dirname, ".."),
  encoding: "utf8",
});

const header = [
  "-- De' Lead Web — full schema DDL",
  "-- Generated from src/schema.ts by: pnpm --filter @delead/db schema",
  "-- Applied to Supabase via generated migrations: pnpm --filter @delead/db migrate",
  "-- Do not hand-edit; edit src/schema.ts instead.",
  "",
  "",
].join("\n");

writeFileSync(resolve(import.meta.dirname, "../schema.sql"), header + ddl.trimStart());
console.log("✔ schema.sql updated");
