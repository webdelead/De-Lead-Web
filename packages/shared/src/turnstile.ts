/**
 * Verify a Cloudflare Turnstile token.
 *
 * Modes, in order:
 *   1. No `TURNSTILE_SECRET_KEY` set → cannot verify. Returns `true` (allow),
 *      but logs an error in production so a missing key is visible.
 *   2. Secret set, `TURNSTILE_ENFORCE` !== "true" → monitor mode: verifies and
 *      logs failures, but still returns `true`.
 *   3. Secret set, `TURNSTILE_ENFORCE` === "true" → fail CLOSED: a missing
 *      token or an explicit `success:false` from Cloudflare returns `false`.
 *      The one exception is our own verifier being unreachable (network error /
 *      timeout) — that stays fail-open so a Cloudflare outage can't take down
 *      all lead + booking capture; it is logged as an error.
 *
 * NOTE: no site currently renders a Turnstile widget, so nothing sends a token.
 * Do NOT set `TURNSTILE_ENFORCE=true` in production until the widget is live on
 * every lead form and the TinkerChamps booking modal, or every submission will
 * be rejected.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const enforce = process.env.TURNSTILE_ENFORCE === "true";

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("turnstile: TURNSTILE_SECRET_KEY is not set — captcha disabled");
    }
    return true;
  }

  if (!token) {
    if (enforce) {
      console.warn("turnstile: no token supplied (enforce mode) — rejecting");
      return false;
    }
    console.warn("turnstile: no token supplied (monitor mode, allowing)");
    return true;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return true;

    // Explicit failure from Cloudflare — this is the case enforce mode blocks on.
    console.warn("turnstile: verification failed", data["error-codes"] ?? []);
    return !enforce;
  } catch (e) {
    // Our verifier is unreachable. Fail open in both modes so a Cloudflare
    // outage doesn't nuke all form submissions, but make it loud.
    console.error("turnstile: verifier unreachable, failing open:", e);
    return true;
  }
}
