import { requireEnv } from "./_env";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { resolve } from "node:path";

const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");

const sql = postgres(url, { max: 1, prepare: false });
const db = drizzle(sql);

console.log("Running migrations…");
await migrate(db, { migrationsFolder: resolve(import.meta.dirname, "../drizzle") });
console.log("✔ migrations applied");
await sql.end();
