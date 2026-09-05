/* One-off: add the extra MakerChamps session photos the client dropped in a
 * Google Drive folder (2026-09) to the gallery — the marquee only had the
 * original 8 populate.ts photos, so it read as very repetitive once the
 * scroll-linked rows looped. Source files were downloaded to /tmp/mc-drive/
 * (not committed — see SRC_DIR below) before this ran.
 *
 * Each photo is compressed the same way a dashboard upload would be
 * (lib/actions/content.ts in apps/dashboard): EXIF-rotated, capped at 2400px
 * on the long side, re-encoded as WebP q82 — the source PNGs were raw
 * ~19-22MB phone screenshots-of-camera-roll exports.
 *
 * Additive only — appends after makerchamps' existing gallery_images rows
 * (continues sortOrder from the current max). Safe to re-run: skips any
 * source file whose upload path already has an asset row.
 */
import { requireEnv } from "./_env";
import { readFileSync, readdirSync } from "node:fs";
import { createDb } from "../src/client";
import { assets, galleryImages } from "../src/schema";
import { eq, and, max } from "drizzle-orm";
import sharp from "sharp";

const SRC_DIR = "/tmp/mc-drive";
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db } = createDb(DB_URL);

const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

// file -> caption. Anything not listed gets a generic caption.
const CAPTIONS: Record<string, string> = {
  "1.png": "Hands-on chemistry lab session at NIT Calicut",
  "2.png": "Students on a guided optics & photonics lab tour",
  "7.png": "A mentor walks students through a rotary evaporator demo",
  "extra-1.jpg": "MakerChamps trophy presentation, ECE department",
  "extra-2.jpg": "MakerChamps closing ceremony on stage",
};
const DEFAULT_CAPTION = "MakerChamps students on the NIT Calicut campus";

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}

async function up(localFile: string, bucket: string, key: string, vertical: string, alt: string) {
  const raw = readFileSync(`${SRC_DIR}/${localFile}`);
  const webp = await sharp(raw, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: new Uint8Array(webp),
  });
  if (!put.ok) throw new Error(`upload ${key}: ${put.status} ${await put.text()}`);

  const [row] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket,
      path: key,
      mime: "image/webp",
      bytes: webp.byteLength,
      vertical: vertical as never,
      alt,
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { alt, bytes: webp.byteLength },
    })
    .returning({ id: assets.id });
  console.log(`  ${localFile}: ${(raw.byteLength / 1024 / 1024).toFixed(1)}MB → ${(webp.byteLength / 1024).toFixed(0)}KB`);
  return row!.id;
}

async function main() {
  await ensureBucket("shared");

  const files = readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  if (!files.length) {
    console.log(`No image files found in ${SRC_DIR} — nothing to do.`);
    process.exit(0);
  }

  const already = await db
    .select({ path: assets.path })
    .from(assets)
    .where(and(eq(assets.bucket, "shared"), eq(assets.vertical, "makerchamps" as never)));
  const existingPaths = new Set(already.map((r) => r.path));

  const maxRows = await db
    .select({ value: max(galleryImages.sortOrder) })
    .from(galleryImages)
    .where(eq(galleryImages.vertical, "makerchamps" as never));
  let nextOrder = (maxRows[0]?.value ?? -1) + 1;

  let inserted = 0;
  for (const file of files) {
    const key = `makerchamps/gallery-drive/${file.replace(/\.(png|jpe?g)$/i, ".webp")}`;
    if (existingPaths.has(key)) {
      console.log(`↷ skip (already uploaded): ${file}`);
      continue;
    }
    const alt = CAPTIONS[file] ?? DEFAULT_CAPTION;
    const assetId = await up(file, "shared", key, "makerchamps", alt);
    await db.insert(galleryImages).values({
      vertical: "makerchamps" as never,
      title: alt,
      assetId,
      sortOrder: nextOrder++,
    });
    inserted++;
  }
  console.log(`\nDone: ${inserted} new gallery_images rows added to makerchamps (${files.length - inserted} already present).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
