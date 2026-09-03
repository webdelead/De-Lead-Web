import { NextResponse, after } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { getDb, leads, sql } from "@delead/db";
import { DB_VERTICAL_KEYS } from "@delead/brand/verticals";

const ORIGINS = [
  process.env.SITE_URL_DELEADINT,
  process.env.SITE_URL_WALK2LEAD,
  process.env.SITE_URL_MAKERCHAMPS,
  process.env.SITE_URL_CORPORATE,
  process.env.SITE_URL_DLI_EDUCATION,
  process.env.SITE_URL_TINKERCHAMPS,
].filter(Boolean) as string[];

const APPS_SCRIPT: Record<string, string | undefined> = {
  deleadint: process.env.APPS_SCRIPT_URL_DELEADINT,
  walk2lead: process.env.APPS_SCRIPT_URL_WALK2LEAD,
  makerchamps: process.env.APPS_SCRIPT_URL_MAKERCHAMPS,
  corporate: process.env.APPS_SCRIPT_URL_CORPORATE,
  dli_education: process.env.APPS_SCRIPT_URL_DLI_EDUCATION,
  tinkerchamps: process.env.APPS_SCRIPT_URL_TINKERCHAMPS,
};

const schema = z.object({
  source: z.string().refine((v) => DB_VERTICAL_KEYS.includes(v) || v.includes("-")),
  name: z.string().min(1).max(200),
  email: z.string().email().max(200).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  interest: z.string().max(200).optional().or(z.literal("")),
  message: z.string().max(5000).optional().or(z.literal("")),
  pagePath: z.string().max(300).optional(),
});

function cors(origin: string | null) {
  const allow = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function POST(req: Request) {
  const headers = cors(req.headers.get("origin"));
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400, headers });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422, headers });
  }
  const d = parsed.data;
  const sourceKey = d.source.replace(/-/g, "_");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex").slice(0, 32) : null;

  const db = getDb();

  // light rate-limit: same ip + same source, 3 in the last 2 minutes
  if (ipHash) {
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(leads)
      .where(
        sql`${leads.ipHash} = ${ipHash} and ${leads.source} = ${sourceKey} and ${leads.createdAt} > now() - interval '2 minutes'`,
      );
    if (n >= 3) {
      return NextResponse.json({ ok: true }, { headers }); // silently accept, don't store
    }
  }

  await db.insert(leads).values({
    source: sourceKey as never,
    name: d.name,
    email: d.email || null,
    phone: d.phone || null,
    interest: d.interest || null,
    message: d.message || null,
    pagePath: d.pagePath ?? null,
    userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    ipHash,
  });

  // fire-and-forget: mirror to that site's Google Sheet + notify
  const hook = APPS_SCRIPT[sourceKey];
  if (hook) {
    after(async () => {
      try {
        await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, receivedAt: new Date().toISOString() }),
          signal: AbortSignal.timeout(8000),
        });
      } catch {
        /* never fails the request */
      }
    });
  }

  return NextResponse.json({ ok: true }, { headers });
}
