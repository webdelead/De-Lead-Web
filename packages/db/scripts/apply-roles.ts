import { requireEnv } from "./_env";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

// Applies scripts/roles.sql, then (optionally) flips each role to LOGIN with a
// password taken from the environment. Uses the owner connection (DIRECT_URL).
const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const sql = postgres(url, { max: 1, prepare: false });

const ddl = readFileSync(resolve(import.meta.dirname, "roles.sql"), "utf8");
await sql.unsafe(ddl);
console.log("✔ roles.sql applied (grants + default privileges)");

async function setLogin(role: "delead_web_ro" | "delead_web_app", envKey: string) {
  const pw = process.env[envKey];
  if (!pw) {
    console.log(`• ${envKey} not set — ${role} left NOLOGIN. Set it and re-run, or:`);
    console.log(`    ALTER ROLE ${role} WITH LOGIN PASSWORD '…';`);
    return;
  }
  const escaped = pw.replace(/'/g, "''");
  await sql.unsafe(`ALTER ROLE ${role} WITH LOGIN PASSWORD '${escaped}'`);
  console.log(`✔ ${role} set to LOGIN with password from ${envKey}`);
}

await setLogin("delead_web_ro", "DELEAD_WEB_RO_PASSWORD");
await setLogin("delead_web_app", "DELEAD_WEB_APP_PASSWORD");

await sql.end();
console.log("done. Now put DATABASE_URL_RO (delead_web_ro) in .env — see roles.sql header.");
