import "server-only";
import { buildSafe } from "@delead/shared/build-safe";
import { getReadDb, courses, studentOutcomes, eq, and, asc } from "@delead/db";

export function getCourses(audience: "students" | "professionals") {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(courses)
      .where(and(eq(courses.audience, audience), eq(courses.isActive, true)))
      .orderBy(asc(courses.sortOrder));
  }, []);
}

export function getStudentOutcomes() {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(studentOutcomes)
      .where(and(eq(studentOutcomes.vertical, "dli_education"), eq(studentOutcomes.isActive, true)))
      .orderBy(asc(studentOutcomes.sortOrder));
  }, []);
}
