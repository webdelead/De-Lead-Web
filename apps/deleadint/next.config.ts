// redeploy trigger: 2026-09-09 — PR #11–#16 merges to main were skipped while Vercel Hobby was rate-limited
import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";
import { securityHeaders } from "@delead/shared/headers";

config({ path: resolve(process.cwd(), "../../.env") });

const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "https://admin.deleadint.com/api/lead";
const LEAD_ORIGIN = new URL(LEAD_ENDPOINT).origin;

// deleadint is fully migrated off verbatim CSS/JS, so a CSP is feasible. Start
// Report-Only: it logs violations without blocking. Tighten the `unsafe-inline`
// (Next's bootstrap + style={{}}) to a nonce, then flip to enforcing.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  `connect-src 'self' ${LEAD_ORIGIN} https://script.google.com`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto: https://script.google.com",
].join("; ");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@delead/db",
    "@delead/brand",
    "@delead/shared",
    "@delead/ui",
    "@delead/fonts",
  ],
  serverExternalPackages: ["postgres"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders(),
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;