/**
 * Baseline security response headers for the public marketing sites
 * (deleadint / walk2lead / makerchamps / corporate / dli-education / tinkerchamps).
 *
 * Conservative set only — deliberately **no `Content-Security-Policy`** here: the
 * five converted sites run their client-approved legacy CSS/JS verbatim
 * (inline handlers, inline `<style>`, `document.write`-free but unhashed inline
 * scripts), so a CSP needs its own `Content-Security-Policy-Report-Only`
 * rollout before it can be enforced without breaking the frozen design.
 *
 * Wire into a Next config:
 *
 *   import { securityHeaders } from "@delead/shared/headers";
 *   const nextConfig = {
 *     async headers() {
 *       return [{ source: "/:path*", headers: securityHeaders() }];
 *     },
 *   };
 *
 * The dashboard keeps its own stricter block (with CSP) in
 * `apps/dashboard/next.config.ts` — don't route it through this helper.
 */
export function securityHeaders(): { key: string; value: string }[] {
  return [
    // We never intend these pages to be framed by anyone.
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // 1 year; covers *.<host>. Safe: every host is HTTPS-only on Vercel.
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    // No page needs these APIs; `browsing-topics=()` opts out of the Topics API.
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
  ];
}
