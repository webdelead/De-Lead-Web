import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand", "@delead/shared"],
  serverExternalPackages: ["postgres"],
  eslint: { ignoreDuringBuilds: true },
  output: "standalone", // portable to a VPS; Vercel ignores it
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
