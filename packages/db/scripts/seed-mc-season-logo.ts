/* One-off: upload the existing season-3-logo.webp as a real dashboard asset
 * and point makerchamps' `next_season` site_settings row at it via the new
 * `logoAssetId` field — this is what a super admin would otherwise do once
 * through the dashboard's Settings → Next season → Season logo picker
 * (apps/dashboard/app/(app)/[vertical]/settings/page.tsx). Kept here mainly
 * as a record of how the field is populated / for re-running if the season
 * logo file changes before someone re-uploads it through the UI.
 */
import { requireEnv } from "./_env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createDb } from "../src/client";
import { assets, siteSettings } from "../src/schema";
import { eq, and } from "drizzle-orm";
import sharp from "sharp";

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db } = createDb(DB_URL);

async function main() {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: "shared", name: "shared", public: true }),
  }).catch(() => {});

  const raw = readFileSync(
    resolve(import.meta.dirname, "../../../apps/makerchamps/public/assets/brand/season-3-logo.webp"),
  );
  const webp = await sharp(raw)
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();
  const key = "makerchamps/settings/season-3-logo.webp";

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/shared/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: new Uint8Array(webp),
  });
  if (!put.ok) throw new Error(`upload failed: ${put.status} ${await put.text()}`);

  const [row] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket: "shared",
      path: key,
      mime: "image/webp",
      bytes: webp.byteLength,
      vertical: "makerchamps" as never,
      alt: "MakerChamps Season 3",
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { bytes: webp.byteLength },
    })
    .returning({ id: assets.id });

  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(and(eq(siteSettings.vertical, "makerchamps" as never), eq(siteSettings.key, "next_season")));
  const value = { ...(existing?.value ?? {}), logoAssetId: row!.id };
  await db
    .insert(siteSettings)
    .values({ vertical: "makerchamps" as never, key: "next_season", value })
    .onConflictDoUpdate({
      target: [siteSettings.vertical, siteSettings.key],
      set: { value, updatedAt: new Date() },
    });

  console.log("asset id:", row!.id);
  console.log("next_season now:", value);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
