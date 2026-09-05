/* One-off: copy every Walk2Lead newspaper-cutting scan into De' Lead
 * International's own press_clippings too, so the hub site's press section
 * carries the full set of coverage, not just the 6 curated HUB_PRESS ones.
 *
 * Deliberately NOT a shared asset — walk2lead's own asset rows are scoped
 * `vertical = 'walk2lead'` and every dashboard mutation is guarded by that
 * scope (see CLAUDE.md), so the hub can't reference them directly even if
 * we wanted to. Each cutting gets its own fresh upload + its own `assets`
 * row scoped `vertical = 'deleadint'` (bucket "shared", path
 * `deleadint/press-w2l/<file>`, distinct from HUB_PRESS's own
 * `deleadint/press/<file>` namespace) and its own press_clippings row.
 *
 * Additive only — appends after deleadint's existing press_clippings rows
 * (continues sortOrder from the current max) rather than the delete+rebuild
 * pattern populate.ts uses, so it won't disturb the 6 HUB_PRESS rows or any
 * manual dashboard edits made since. Safe to re-run: skips any cutting
 * whose upload path already has a deleadint press_clippings row pointing
 * at it.
 */
import { requireEnv } from "./_env";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createDb } from "../src/client";
import { assets, pressClippings } from "../src/schema";
import { eq, and, max } from "drizzle-orm";

const ROOT = resolve(import.meta.dirname, "../../..");
const APPS = resolve(ROOT, "apps");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db } = createDb(DB_URL);

// same 26 files + place-name titles as populate.ts's W2L_PRESS
const W2L_PRESS: [string, string][] = [
  ["news-feroke.jpg", "Feroke"], ["news-wa-0085.jpg", ""], ["news-wa-0013.jpg", ""],
  ["news-wa-0015.jpg", ""], ["news-wa-0008.jpg", ""], ["news-wa-0009.jpg", ""],
  ["news-karuvanpoyil.jpg", "Karuvanpoyil"], ["news-manassery.jpg", "Manassery"],
  ["news-meenchanda-1.jpg", "Meenchanda"], ["news-meenchanda-2.jpg", "Meenchanda"],
  ["news-meenchanda-3.jpg", "Meenchanda"], ["news-meppayil.jpg", "Meppayil"],
  ["news-nallalam.jpg", "Nallalam"], ["news-snbm.jpg", ""], ["news-thurayur.jpg", "Thurayur"],
  ["news-wa-1.jpg", ""], ["news-wa-2.jpg", ""], ["news-wa-3.jpg", ""], ["news-wa-4.jpg", ""],
  ["news-wa-5.jpg", ""], ["news-wa-6.jpg", ""], ["news-wa-7.jpg", ""], ["news-wa-8.jpg", ""],
  ["news-comb-1.jpg", "Coverage compilation"], ["news-comb-2.jpg", "Coverage compilation"],
  ["news-comb-3.jpg", "Coverage compilation"], ["news-newspaper.jpg", ""],
];

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}

async function up(localRel: string, bucket: string, key: string, vertical: string, alt: string) {
  const path = resolve(APPS, localRel);
  const buf = readFileSync(path);
  const mime = "image/jpeg";

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": mime, "x-upsert": "true" },
    body: new Uint8Array(buf),
  });
  if (!put.ok) throw new Error(`upload ${key}: ${put.status} ${await put.text()}`);

  const [row] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket,
      path: key,
      mime,
      bytes: statSync(path).size,
      vertical: vertical as never,
      alt,
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { alt, bytes: statSync(path).size },
    })
    .returning({ id: assets.id });
  return row!.id;
}

async function main() {
  await ensureBucket("shared");

  const already = await db
    .select({ path: assets.path })
    .from(assets)
    .where(and(eq(assets.bucket, "shared"), eq(assets.vertical, "deleadint" as never)));
  const existingPaths = new Set(already.map((r) => r.path));

  const maxRows = await db
    .select({ value: max(pressClippings.sortOrder) })
    .from(pressClippings)
    .where(eq(pressClippings.vertical, "deleadint" as never));
  let nextOrder = (maxRows[0]?.value ?? -1) + 1;

  let inserted = 0;
  for (const [file, place] of W2L_PRESS) {
    const key = `deleadint/press-w2l/${file}`;
    if (existingPaths.has(key)) {
      console.log(`↷ skip (already uploaded): ${file}`);
      continue;
    }
    const assetId = await up(
      `walk2lead/public/assets/news/${file}`,
      "shared",
      key,
      "deleadint",
      place ? `${place} newspaper coverage of Walk2Lead` : "Walk2Lead newspaper coverage",
    );
    await db.insert(pressClippings).values({
      vertical: "deleadint" as never,
      title: place,
      publication: "",
      dateStr: "",
      assetId,
      sortOrder: nextOrder++,
    });
    inserted++;
    console.log(`✔ ${file} → deleadint press_clippings`);
  }
  console.log(`\nDone: ${inserted} new press_clippings rows added to deleadint (${W2L_PRESS.length - inserted} already present).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
