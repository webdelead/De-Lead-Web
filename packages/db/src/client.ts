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
 * Shared pools for app runtime (Next server), cached on `globalThis` so `next
 * dev` HMR reloads reuse one pool instead of leaking a new one per edit.
 */
const _g = globalThis as unknown as { __deleadDb?: DB; __deleadRoDb?: DB };

/**
 * Read/write pool — dashboard + write API routes (leads, bookings). Uses
 * DATABASE_URL: the `delead_web_app` role once the RO/APP split is applied
 * (packages/db/scripts/roles.sql), otherwise whatever DATABASE_URL points at.
 */
export function getDb(): DB {
  if (_g.__deleadDb) return _g.__deleadDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _g.__deleadDb = createDb(url, { max: 1 }).db;
  return _g.__deleadDb;
}

/**
 * Read-only pool for the marketing sites' SSR/ISR content queries. Uses
 * DATABASE_URL_RO (the `delead_web_ro`, SELECT-only role) when set; falls back
 * to DATABASE_URL so nothing breaks before the split is provisioned.
 */
export function getReadDb(): DB {
  if (_g.__deleadRoDb) return _g.__deleadRoDb;
  const url = process.env.DATABASE_URL_RO || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_RO / DATABASE_URL is not set");
  _g.__deleadRoDb = createDb(url, { max: 1 }).db;
  return _g.__deleadRoDb;
}
