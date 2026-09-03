import {
  createDb,
  testimonials,
  pressClippings,
  w2lProjects,
  w2lPhases,
  siteStats,
  assets,
  eq,
  and,
  asc,
  inArray,
} from "@delead/db";
import { assetUrl } from "@delead/ui/lib";

const { db } = createDb(process.env.DATABASE_URL!);

async function withAssets<T extends Record<string, any>>(rows: T[], key: string) {
  const ids = rows.map((r) => r[key]).filter(Boolean) as string[];
  const map = ids.length
    ? new Map((await db.select().from(assets).where(inArray(assets.id, ids))).map((a) => [a.id, assetUrl(a)]))
    : new Map();
  return rows.map((r) => ({ ...r, _url: r[key] ? (map.get(r[key]) ?? "") : "" }));
}

export async function getContent() {
  const [t, p, proj, phases, stats] = await Promise.all([
    db.select().from(testimonials).where(and(eq(testimonials.vertical, "walk2lead"), eq(testimonials.isActive, true))).orderBy(asc(testimonials.sortOrder)),
    db.select().from(pressClippings).where(and(eq(pressClippings.vertical, "walk2lead"), eq(pressClippings.isActive, true))).orderBy(asc(pressClippings.sortOrder)),
    db.select().from(w2lProjects).where(eq(w2lProjects.isActive, true)).orderBy(asc(w2lProjects.sortOrder)),
    db.select().from(w2lPhases).where(eq(w2lPhases.isActive, true)).orderBy(asc(w2lPhases.sortOrder)),
    db.select().from(siteStats).where(eq(siteStats.vertical, "walk2lead")).orderBy(asc(siteStats.sortOrder)),
  ]);
  return {
    testimonials: t,
    press: await withAssets(p, "assetId"),
    projects: await withAssets(proj, "assetId"),
    phases,
    stats,
  };
}
