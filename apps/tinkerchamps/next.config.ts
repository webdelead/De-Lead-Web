// redeploy trigger: 2026-09-09 — PR #11–#16 merges to main were skipped while Vercel Hobby was rate-limited
import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";
import { securityHeaders } from "@delead/shared/headers";

// monorepo-root .env (Vercel-set vars win)
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand", "@delead/shared", "@delead/ui"],
  serverExternalPackages: ["postgres"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  // Baseline only — no CSP yet (Google Analytics + inline bootstrap would need a
  // report-only rollout first). See @delead/shared/headers.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
};

export default nextConfig;