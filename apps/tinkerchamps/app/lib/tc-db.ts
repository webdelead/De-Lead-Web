import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import {
  getReadDb,
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

async function urlMap(ids: (string | null)[]) {
  const db = getReadDb();
  const clean = [...new Set(ids.filter(Boolean) as string[])];
  if (!clean.length) return new Map<string, string>();
  const rows = await db.select().from(assets).where(inArray(assets.id, clean));
  return new Map(rows.map((a) => [a.id, assetPublicUrl(a)]));
}

export async function getEvents(activeOnly: boolean) {
  const db = getReadDb();
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
  const db = getReadDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "tinkerchamps"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  const urls = await urlMap(rows.map((r) => r.assetId));
  return rows.map((g) => ({ _id: g.id, image: urls.get(g.assetId) ?? "", order: g.sortOrder }));
}

export async function getReviews() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(whatsappReviews)
    .where(and(eq(whatsappReviews.vertical, "tinkerchamps"), eq(whatsappReviews.isActive, true)))
    .orderBy(asc(whatsappReviews.sortOrder));
  const urls = await urlMap(rows.map((r) => r.assetId));
  return rows.map((r) => ({ _id: r.id, screenshot: urls.get(r.assetId) ?? "", title: r.title }));
}
