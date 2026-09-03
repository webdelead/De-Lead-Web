import { createDb, courses, studentOutcomes, testimonials, siteStats, eq, and, asc } from "@delead/db";

const { db } = createDb(process.env.DATABASE_URL!);

export async function getContent() {
  const [allCourses, outcomes, t, stats] = await Promise.all([
    db.select().from(courses).where(eq(courses.isActive, true)).orderBy(asc(courses.sortOrder)),
    db.select().from(studentOutcomes).where(and(eq(studentOutcomes.vertical, "dli_education"), eq(studentOutcomes.isActive, true))).orderBy(asc(studentOutcomes.sortOrder)),
    db.select().from(testimonials).where(and(eq(testimonials.vertical, "dli_education"), eq(testimonials.isActive, true))).orderBy(asc(testimonials.sortOrder)),
    db.select().from(siteStats).where(eq(siteStats.vertical, "dli_education")).orderBy(asc(siteStats.sortOrder)),
  ]);
  return {
    coursesStudents: allCourses.filter((c) => c.audience === "students"),
    coursesPros: allCourses.filter((c) => c.audience === "professionals"),
    outcomes,
    testimonials: t,
    stats,
  };
}
