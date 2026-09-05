/* One-off / test data: the "What Parents Share on WhatsApp" marquee on
 * MakerChamps (components/S10b_whatsapp.tsx) needed something to render
 * while real screenshots aren't in yet — uploads the client-provided
 * "WhatsApp Testimonials.png" (a full poster, not an individual screenshot)
 * N times as placeholder rows so the auto-scroll marquee has enough cards
 * to actually loop. Delete these rows from the dashboard once real
 * per-parent WhatsApp screenshots are ready — they're clearly marked with
 * a "(test)" title so they're easy to find and remove.
 *
 * Safe to re-run: it always inserts N *new* rows (each upload gets its own
 * storage path with an index suffix), so re-running just adds more test
 * rows rather than duplicating — delete the old ones from the dashboard
 * first if you don't want that.
 */
import { requireEnv } from "./_env";
import { readFileSync } from "node:fs";
import { createDb } from "../src/client";
import { assets, whatsappReviews } from "../src/schema";
import { eq, and, max } from "drizzle-orm";
import sharp from "sharp";

const SRC = "/Users/salah/Downloads/WhatsApp Testimonials.png";
const COPIES = 6;

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

  const raw = readFileSync(SRC);
  const webp = await sharp(raw)
    .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const maxRows = await db
    .select({ value: max(whatsappReviews.sortOrder) })
    .from(whatsappReviews)
    .where(eq(whatsappReviews.vertical, "makerchamps" as never));
  let nextOrder = (maxRows[0]?.value ?? -1) + 1;

  for (let i = 1; i <= COPIES; i++) {
    const key = `makerchamps/whatsapp-test/test-${Date.now()}-${i}.webp`;
    const put = await fetch(`${SUPABASE_URL}/storage/v1/object/shared/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "image/webp", "x-upsert": "true" },
      body: new Uint8Array(webp),
    });
    if (!put.ok) throw new Error(`upload ${key}: ${put.status} ${await put.text()}`);

    const [row] = await db
      .insert(assets)
      .values({
        provider: "supabase",
        bucket: "shared",
        path: key,
        mime: "image/webp",
        bytes: webp.byteLength,
        vertical: "makerchamps" as never,
        alt: "WhatsApp message from a MakerChamps parent (test placeholder)",
      })
      .returning({ id: assets.id });

    await db.insert(whatsappReviews).values({
      vertical: "makerchamps" as never,
      title: `(test) placeholder ${i}`,
      assetId: row!.id,
      sortOrder: nextOrder++,
    });
    console.log(`✔ uploaded test copy ${i}/${COPIES}`);
  }
  console.log(`\nDone: ${COPIES} test whatsapp_reviews rows added to makerchamps.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
