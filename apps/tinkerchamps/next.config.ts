import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";

// monorepo-root .env (Vercel-set vars win)
config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand"],
  serverExternalPackages: ["postgres"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
