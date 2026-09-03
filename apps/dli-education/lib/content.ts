import "server-only";
import { getReadDb, courses, studentOutcomes, eq, and, asc } from "@delead/db";

export async function getCourses(audience: "students" | "professionals") {
  const db = getReadDb();
  return db
    .select()
    .from(courses)
    .where(and(eq(courses.audience, audience), eq(courses.isActive, true)))
    .orderBy(asc(courses.sortOrder));
}

export async function getStudentOutcomes() {
  const db = getReadDb();
  return db
    .select()
    .from(studentOutcomes)
    .where(and(eq(studentOutcomes.vertical, "dli_education"), eq(studentOutcomes.isActive, true)))
    .orderBy(asc(studentOutcomes.sortOrder));
}
