import { requireEnv } from "./_env";
import { createClient } from "@supabase/supabase-js";
import { createDb } from "../src/client";
import { users, publishState, siteSettings } from "../src/schema";
import { sql } from "drizzle-orm";
import { DB_VERTICAL_KEYS } from "@delead/brand/verticals";

const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql: raw } = createDb(url);

const admin = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function ensureAuthUser(email: string, password: string): Promise<string> {
  // is there already an auth user with this email?
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    // make sure the password matches what's in .env, and it's confirmed
    await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    return existing.id;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(`createUser: ${error?.message}`);
  return data.user.id;
}

async function main() {
  const email = requireEnv("SEED_ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("SEED_ADMIN_PASSWORD");

  const uid = await ensureAuthUser(email, password);
  console.log(`✔ supabase auth user: ${email} (${uid})`);

  // drop any stale profile rows for this email that aren't the auth uid
  await raw`delete from users where lower(email) = ${email} and id <> ${uid}`;

  await db
    .insert(users)
    .values({ id: uid, email, name: "Web Admin", role: "super_admin", isActive: true })
    .onConflictDoUpdate({
      target: users.id,
      set: { role: "super_admin", isActive: true, email },
    });
  console.log(`✔ profile row: super_admin`);

  for (const key of DB_VERTICAL_KEYS) {
    await db
      .insert(publishState)
      .values({ vertical: key as never, dirtyCount: 0 })
      .onConflictDoNothing();
  }
  console.log(`✔ publish_state seeded (${DB_VERTICAL_KEYS.length} verticals)`);

  const defaults: { vertical: string; key: string; value: Record<string, unknown> }[] = [
    {
      vertical: "makerchamps",
      key: "next_season",
      value: { active: true, label: "Season 3", dates: "Aug 28–29", campus: "NIT Calicut Campus" },
    },
    {
      vertical: "tinkerchamps",
      key: "hero",
      value: {
        headline: "Rewiring Young Minds for a Limitless Future",
        sub: "A premium 3-day experiential learning camp for students in grades 6–12.",
        ctaLabel: "Book a Seat",
      },
    },
  ];
  for (const d of defaults) {
    await db
      .insert(siteSettings)
      .values({ vertical: d.vertical as never, key: d.key, value: d.value })
      .onConflictDoNothing();
  }
  console.log(`✔ site_settings defaults seeded`);
}

await main();
await raw.end();
console.log("done.");
