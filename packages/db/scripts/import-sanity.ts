/* One-time: pull TinkerChamps content out of Sanity into Postgres.
 *
 *   events           → tc_events
 *   gallery images   → gallery_images (+ assets)   vertical = tinkerchamps
 *   whatsappReview   → whatsapp_reviews (+ assets)
 *
 * Reads Sanity creds from apps/tinkerchamps/.env.local (or the root .env).
 * Images are downloaded from cdn.sanity.io and re-uploaded via lib/storage
 * equivalent here (Supabase Storage REST) so nothing keeps pointing at Sanity.
 *
 * Usage:  pnpm --filter @delead/db import:sanity
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { createDb } from "../src/client";
import { assets, tcEvents, galleryImages, whatsappReviews } from "../src/schema";

const ROOT = resolve(import.meta.dirname, "../../..");
config({ path: resolve(ROOT, "apps/tinkerchamps/.env.local") });
config({ path: resolve(ROOT, ".env") });

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN; // read grant is enough

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DB_URL = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const BUCKET = "tinkerchamps";

if (!PROJECT || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_API_WRITE_TOKEN.");
  console.error("Point this script at apps/tinkerchamps/.env.local or paste a JSON export.");
  process.exit(1);
}

const { db, sql } = createDb(DB_URL);

async function groq<T>(query: string): Promise<T> {
  const url = `https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(
    query,
  )}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  return (await res.json()).result as T;
}

/** turn a Sanity asset ref (image-abc-1200x800-png) into a CDN url */
function cdnUrl(ref: string) {
  const [, id, dims, fmt] = ref.split("-");
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${id}-${dims}.${fmt}`;
}

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}

async function uploadToStorage(srcUrl: string, key: string) {
  const img = await fetch(srcUrl);
  if (!img.ok) throw new Error(`fetch image ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  const mime = img.headers.get("content-type") ?? "image/jpeg";
  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": mime,
      "x-upsert": "true",
    },
    body: buf,
  });
  if (!put.ok) throw new Error(`storage upload ${put.status}: ${await put.text()}`);
  const [{ id }] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket: BUCKET,
      path: key,
      mime,
      bytes: buf.byteLength,
      vertical: "tinkerchamps",
      alt: "",
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { bytes: buf.byteLength, mime },
    })
    .returning({ id: assets.id });
  return id;
}

async function main() {
  await ensureBucket(BUCKET);
  await ensureBucket("shared");
  await ensureBucket("walk2lead");

  // ---- events ----
  const events = await groq<any[]>(
    `*[_type == "event"]{title, "slug": slug.current, description, date, location, audience, duration, inclusion, isFeatured, order, stats, logo}`,
  );
  for (const e of events) {
    let logoAssetId: string | null = null;
    if (e.logo?.asset?._ref) {
      logoAssetId = await uploadToStorage(cdnUrl(e.logo.asset._ref), `events/${e.slug}.png`);
    }
    await db
      .insert(tcEvents)
      .values({
        title: e.title,
        slug: e.slug,
        logoAssetId,
        description: e.description ?? "",
        dateStr: e.date ?? "",
        location: e.location ?? "",
        audience: e.audience ?? "Students",
        duration: e.duration ?? "3 Days Residential",
        inclusion: e.inclusion ?? "Food Included",
        isFeatured: !!e.isFeatured,
        sortOrder: e.order ?? 0,
        stats: (e.stats ?? []).map((s: any) => ({ icon: s.icon, title: s.title, text: s.text })),
      })
      .onConflictDoNothing();
  }
  console.log(`✔ events: ${events.length}`);

  // ---- gallery ----
  const gallery = await groq<any[]>(`*[_type == "gallery"]{title, image, _id}`);
  let g = 0;
  for (const item of gallery) {
    if (!item.image?.asset?._ref) continue;
    const assetId = await uploadToStorage(cdnUrl(item.image.asset._ref), `gallery/${item._id}.jpg`);
    await db
      .insert(galleryImages)
      .values({ vertical: "tinkerchamps", title: item.title ?? "", assetId, sortOrder: g })
      .onConflictDoNothing();
    g++;
  }
  console.log(`✔ gallery: ${g}`);

  // ---- whatsapp reviews ----
  const reviews = await groq<any[]>(`*[_type == "whatsappReview"]{title, screenshot, _id}`);
  let r = 0;
  for (const item of reviews) {
    if (!item.screenshot?.asset?._ref) continue;
    const assetId = await uploadToStorage(
      cdnUrl(item.screenshot.asset._ref),
      `whatsapp/${item._id}.png`,
    );
    await db
      .insert(whatsappReviews)
      .values({ vertical: "tinkerchamps", title: item.title ?? "", assetId, sortOrder: r })
      .onConflictDoNothing();
    r++;
  }
  console.log(`✔ whatsapp reviews: ${r}`);
}

await main();
await sql.end();
console.log("sanity import done.");
