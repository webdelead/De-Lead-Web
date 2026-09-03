import { requireEnv } from "./_env";
import { createDb } from "../src/client";
import { flushOutbox } from "../src/outbox";

// Periodic outbox drain (GitHub Actions). Opportunistic draining also happens
// on every /api/lead and /api/booking write; this catches the tail when a site
// is quiet or a request-time drain was evicted.
const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql } = createDb(url, { max: 1 });

const res = await flushOutbox(db, { limit: 100 });
console.log(
  `✔ outbox flush — picked ${res.picked}, sent ${res.sent}, retried ${res.retried}, failed ${res.failed}`,
);

await sql.end();
