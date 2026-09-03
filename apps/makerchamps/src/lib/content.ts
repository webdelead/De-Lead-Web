import {
  createDb,
  testimonials,
  siteStats,
  siteSettings,
  eq,
  and,
  asc,
} from "@delead/db";

const { db } = createDb(process.env.DATABASE_URL!);

export async function getContent() {
  const [t, stats, settings] = await Promise.all([
    db.select().from(testimonials).where(and(eq(testimonials.vertical, "makerchamps"), eq(testimonials.isActive, true))).orderBy(asc(testimonials.sortOrder)),
    db.select().from(siteStats).where(eq(siteStats.vertical, "makerchamps")).orderBy(asc(siteStats.sortOrder)),
    db.select().from(siteSettings).where(eq(siteSettings.vertical, "makerchamps")),
  ]);
  const settingsMap: Record<string, any> = {};
  for (const s of settings) settingsMap[s.key] = s.value;
  return { testimonials: t, stats, nextSeason: settingsMap.next_season ?? { active: false } };
}
