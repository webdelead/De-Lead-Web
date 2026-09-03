import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";

// load monorepo-root .env (Vercel-set vars already in process.env win)
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand"],
  serverExternalPackages: ["postgres"],
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },    ],
  },
  async headers() {
    return [
      {
        source: "/api/lead",
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
            value: "frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
