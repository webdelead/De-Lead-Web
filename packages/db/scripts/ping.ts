import { requireEnv } from "./_env";
import postgres from "postgres";

// Keeps the free Supabase project from pausing. Run 4×/week by GitHub Actions.
const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const sql = postgres(url, { max: 1, prepare: false });

const src = process.argv[2] ?? "cron";
await sql`insert into ping_log (source) values (${src})`;
const rows = await sql<{ count: number }[]>`select count(*)::int as count from ping_log`;
console.log(`✔ ping ok — ${rows[0]?.count ?? 0} total pings`);
await sql.end();
