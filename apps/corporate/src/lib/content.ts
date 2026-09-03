import { createDb, testimonials, trackRecord, siteStats, eq, and, asc } from "@delead/db";

const { db } = createDb(process.env.DATABASE_URL!);

export async function getContent() {
  const [t, track, stats] = await Promise.all([
    db.select().from(testimonials).where(and(eq(testimonials.vertical, "corporate"), eq(testimonials.isActive, true))).orderBy(asc(testimonials.sortOrder)),
    db.select().from(trackRecord).where(eq(trackRecord.isActive, true)).orderBy(asc(trackRecord.sortOrder)),
    db.select().from(siteStats).where(eq(siteStats.vertical, "corporate")).orderBy(asc(siteStats.sortOrder)),
  ]);
  return { testimonials: t, track, stats };
}
