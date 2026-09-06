import { createHash } from "node:crypto";

/**
 * Trustworthy client IP for a request handled behind the Vercel edge.
 *
 * On Vercel `x-vercel-forwarded-for` / `x-real-ip` are set by the platform edge
 * and overwrite anything the client sends. The client-controlled
 * `x-forwarded-for` is only a last resort, and we take the LAST hop (closest to
 * our infra), never the spoofable left-most value.
 *
 * Shared by `/api/lead` and `/api/booking` (both Node-runtime route handlers).
 */
export function clientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return parts[parts.length - 1] ?? "";
  }
  return "";
}

/** SHA-256 of the IP, truncated to 32 hex chars — what we persist (never the raw IP). */
export function ipHashOf(ip: string): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
