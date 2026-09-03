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

/**
 * Shared singleton for app runtime (Next server). Uses DATABASE_URL (pooler).
 * Cached on `globalThis` so `next dev` HMR reloads reuse one connection pool
 * instead of leaking a new one on every edit (which exhausts the Supabase
 * pooler and makes queries hang).
 */
const _g = globalThis as unknown as { __deleadDb?: DB };

export function getDb(): DB {
  if (_g.__deleadDb) return _g.__deleadDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _g.__deleadDb = createDb(url, { max: 1 }).db;
  return _g.__deleadDb;
}
