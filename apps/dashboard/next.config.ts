import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";

// load monorepo-root .env (Vercel-set vars already in process.env win)
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/ui", "@delead/brand"],
  serverExternalPackages: ["postgres"],
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/lead",
        headers: [{ key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" }],
      },
    ];
  },
};

export default nextConfig;
