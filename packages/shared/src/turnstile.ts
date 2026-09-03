/**
 * Verify a Cloudflare Turnstile token. No-op (returns true) until
 * TURNSTILE_SECRET_KEY is set; once set it verifies but only *blocks*
 * (returns false) when TURNSTILE_ENFORCE=true — monitor-first rollout.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
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
    return true; // fail-open on our verifier being down
  }
  if (process.env.TURNSTILE_ENFORCE === "true") return false;
  console.warn("turnstile check failed (monitor mode, allowing)");
  return true;
}
