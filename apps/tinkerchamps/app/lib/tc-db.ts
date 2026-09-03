import "server-only";
import {
  createDb,
  tcEvents,
  galleryImages,
  whatsappReviews,
  assets,
  eq,
  and,
  asc,
  desc,
  inArray,
} from "@delead/db";

const { db } = createDb(process.env.DATABASE_URL!);

async function urlMap(ids: (string | null)[]) {
  const clean = [...new Set(ids.filter(Boolean) as string[])];
  if (!clean.length) return new Map<string, string>();
  const rows = await db.select().from(assets).where(inArray(assets.id, clean));
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  return new Map(
    rows.map((a) => [
      a.id,
      a.provider === "r2"
        ? `${(process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${a.path}`
        : `${base}/storage/v1/object/public/${a.bucket}/${a.path}`,
    ]),
  );
}

export async function getEvents(activeOnly: boolean) {
  const rows = await db
    .select()
    .from(tcEvents)
    .where(activeOnly ? eq(tcEvents.isActive, true) : undefined)
    .orderBy(asc(tcEvents.sortOrder), desc(tcEvents.dateStr));
  const logos = await urlMap(rows.map((r) => r.logoAssetId));
  return rows.map((e) => ({
    _id: e.id,
    title: e.title,
    slug: { current: e.slug },
    logo: e.logoAssetId ? (logos.get(e.logoAssetId) ?? "") : "",
    description: e.description,
    date: e.dateStr,
    location: e.location,
    audience: e.audience,
    duration: e.duration,
    inclusion: e.inclusion,
    isFeatured: e.isFeatured,
    isActive: e.isActive,
    order: e.sortOrder,
    stats: e.stats ?? [],
  }));
}

export async function getGallery() {
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "tinkerchamps"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  const urls = await urlMap(rows.map((r) => r.assetId));
  return rows.map((g) => ({ _id: g.id, image: urls.get(g.assetId) ?? "", order: g.sortOrder }));
}

export async function getReviews() {
  const rows = await db
    .select()
    .from(whatsappReviews)
    .where(and(eq(whatsappReviews.vertical, "tinkerchamps"), eq(whatsappReviews.isActive, true)))
    .orderBy(asc(whatsappReviews.sortOrder));
  const urls = await urlMap(rows.map((r) => r.assetId));
  return rows.map((r) => ({ _id: r.id, screenshot: urls.get(r.assetId) ?? "", title: r.title }));
}
