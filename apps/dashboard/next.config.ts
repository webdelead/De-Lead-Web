import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";

// load monorepo-root .env (Vercel-set vars already in process.env win)
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand", "@delead/shared"],
  serverExternalPackages: ["postgres", "sharp"],
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Server Actions default to a 1 MB request body — asset uploads (image
    // picker → uploadAsset) go through a server action, not a route handler,
    // so this is what actually gates upload size, not MAX_UPLOAD_BYTES in
    // lib/actions/content.ts. Keep in sync with that constant.
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },    ],
  },
  async headers() {
    return [
      {
        source: "/api/(lead|booking)",
        headers: [{ key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" }],
      },
      {
        // security headers for the whole admin app
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://*.supabase.co",
              "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
              // Next injects inline bootstrap script/style; no nonce pipeline yet.
              // Dev (Fast Refresh / HMR) needs 'unsafe-eval'; prod build does not.
              process.env.NODE_ENV === "development"
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src https://challenges.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
