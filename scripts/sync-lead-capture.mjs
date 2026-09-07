#!/usr/bin/env node
/**
 * Copy the canonical browser lead-capture script into every marketing app's
 * public/ folder. The apps are separate Vercel deployments, so each needs its
 * own physical copy — this keeps the one source of truth in sync.
 *
 *   node scripts/sync-lead-capture.mjs           # write the copies
 *   node scripts/sync-lead-capture.mjs --check   # exit 1 if any copy is stale (CI)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(root, "packages/shared/browser/lead-capture.js");
const APPS = ["deleadint", "makerchamps", "corporate", "dli-education"]; // walk2lead migrated to a client component
const target = (app) => resolve(root, "apps", app, "public/js/lead-capture.js");

const check = process.argv.includes("--check");
const src = readFileSync(SOURCE, "utf8");
const stale = [];

for (const app of APPS) {
  const path = target(app);
  let current = "";
  try {
    current = readFileSync(path, "utf8");
  } catch {
    /* missing counts as stale */
  }
  if (current === src) continue;
  stale.push(app);
  if (!check) {
    writeFileSync(path, src);
    console.log(`synced apps/${app}/public/js/lead-capture.js`);
  }
}

if (check && stale.length) {
  console.error(
    `lead-capture.js out of sync in: ${stale.join(", ")}\n` +
      `Run \`pnpm sync:lead-capture\` and commit the result.`,
  );
  process.exit(1);
}
if (!check && !stale.length) console.log("lead-capture.js already in sync");
