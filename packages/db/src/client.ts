import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DB = ReturnType<typeof createDb>["db"];

/** Create a pooled client. `prepare: false` is required for Supabase's
 *  transaction pooler (pgbouncer transaction mode). */
export function createDb(url: string, opts?: { max?: number }) {
  const sql = postgres(url, {
    prepare: false,
    max: opts?.max ?? 1,
    idle_timeout: 20,
    // recycle pooled connections so a long-running dev/server process never
    // reuses one the Supabase pooler has already closed (was causing
    // "canceling statement due to statement timeout" on the next query)
    max_lifetime: 60 * 10,
    connect_timeout: 15,
  });
  const db = drizzle(sql, { schema, casing: "snake_case" });
  return { db, sql };
}

let _db: DB | undefined;

/** Shared singleton for app runtime (Next server). Uses DATABASE_URL (pooler). */
export function getDb(): DB {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _db = createDb(url, { max: 1 }).db;
  return _db;
}
