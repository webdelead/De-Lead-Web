import { requireEnv } from "./_env";
import { hash } from "@node-rs/argon2";
import { createDb } from "../src/client";
import { users, publishState, siteSettings } from "../src/schema";
import { sql } from "drizzle-orm";
import { DB_VERTICAL_KEYS } from "@delead/brand/verticals";

const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql: raw } = createDb(url);

const ARGON = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

async function main() {
  // ---- first super admin ----
  const email = requireEnv("SEED_ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("SEED_ADMIN_PASSWORD");
  const passwordHash = await hash(password, ARGON);

  await db
    .insert(users)
    .values({ email, passwordHash, name: "Web Admin", role: "super_admin" })
    .onConflictDoNothing();
  // if the row already existed, make sure it is a super_admin + active
  await raw`update users set role = 'super_admin', is_active = true where lower(email) = ${email}`;
  console.log(`✔ admin: ${email}`);

  // ---- publish_state rows, one per vertical ----
  for (const key of DB_VERTICAL_KEYS) {
    await db
      .insert(publishState)
      .values({ vertical: key as never, dirtyCount: 0 })
      .onConflictDoNothing();
  }
  console.log(`✔ publish_state seeded (${DB_VERTICAL_KEYS.length} verticals)`);

  // ---- default site settings ----
  const defaults: { vertical: string; key: string; value: Record<string, unknown> }[] = [
    {
      vertical: "makerchamps",
      key: "next_season",
      value: {
        active: true,
        label: "Season 3",
        dates: "Aug 28–29",
        campus: "NIT Calicut Campus",
      },
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
