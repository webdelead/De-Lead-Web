import { NextResponse, after } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { getDb, leads, outbox, sql, flushOutbox } from "@delead/db";
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
  turnstileToken: z.string().max(4000).optional(),
});

/**
 * Cloudflare Turnstile check. No-op until TURNSTILE_SECRET_KEY is set; then it
 * verifies but only *blocks* when TURNSTILE_ENFORCE=true (monitor-first rollout,
 * since the pixel-frozen site forms don't send a token yet).
 */
async function turnstileOk(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const body = new URLSearchParams({ secret, response: token ?? "" });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    if (data.success) return true;
  } catch (e) {
    console.warn("turnstile verify error:", e);
    return true; // don't fail submissions on our verifier being down
  }
  if (process.env.TURNSTILE_ENFORCE === "true") return false;
  console.warn("turnstile check failed (monitor mode, allowing)");
  return true;
}

/**
 * Trustworthy client IP. On Vercel `x-vercel-forwarded-for` / `x-real-ip` are
 * set by the platform edge and overwrite anything the client sends. The
 * client-controlled `x-forwarded-for` is only a last resort, and we take the
 * LAST hop (closest to our infra), never the spoofable left-most value.
 */
function clientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    return parts[parts.length - 1] ?? "";
  }
  return "";
}

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

  const ip = clientIp(req);
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex").slice(0, 32) : null;

  if (!(await turnstileOk(d.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "challenge failed" }, { status: 403, headers });
  }

  const db = getDb();

  // rate-limit by trusted IP: 3 per source / 2 min, and a hard 15 across all
  // sources / 10 min. Over either limit → silently accept, don't store.
  if (ipHash) {
    const [{ perSource, total }] = await db
      .select({
        perSource: sql<number>`count(*) filter (where ${leads.source} = ${sourceKey} and ${leads.createdAt} > now() - interval '2 minutes')::int`,
        total: sql<number>`count(*) filter (where ${leads.createdAt} > now() - interval '10 minutes')::int`,
      })
      .from(leads)
      .where(sql`${leads.ipHash} = ${ipHash} and ${leads.createdAt} > now() - interval '10 minutes'`);
    if (perSource >= 3 || total >= 15) {
      return NextResponse.json({ ok: true }, { headers });
    }
  }

  const leadValues = {
    source: sourceKey as never,
    name: d.name,
    email: d.email || null,
    phone: d.phone || null,
    interest: d.interest || null,
    message: d.message || null,
    pagePath: d.pagePath ?? null,
    userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    ipHash,
  };
  const hook = APPS_SCRIPT[sourceKey];
  const { turnstileToken: _t, ...mirrorFields } = d;
  const mirrorPayload = { ...mirrorFields, receivedAt: new Date().toISOString() };

  // Store the lead + queue the Google Sheet mirror in one transaction, so the
  // mirror survives a dropped request. Fall back to a plain insert if the
  // outbox table isn't there yet.
  try {
    await db.transaction(async (tx) => {
      await tx.insert(leads).values(leadValues);
      if (hook) {
        await tx.insert(outbox).values({ kind: "lead", targetUrl: hook, payload: mirrorPayload });
      }
    });
  } catch (e) {
    console.error("lead transaction failed, falling back to plain insert:", e);
    await db.insert(leads).values(leadValues);
    if (hook) {
      after(() =>
        fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mirrorPayload),
          signal: AbortSignal.timeout(8000),
        }).catch(() => {}),
      );
    }
    return NextResponse.json({ ok: true }, { headers });
  }

  // opportunistic drain — the durable outbox row is the real guarantee
  if (hook) after(() => flushOutbox(db, { limit: 5 }).catch(() => {}));

  return NextResponse.json({ ok: true }, { headers });
}
