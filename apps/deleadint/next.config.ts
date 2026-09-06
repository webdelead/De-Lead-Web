import type { NextConfig } from "next";
import { config } from "dotenv";
import { resolve } from "node:path";
import { securityHeaders } from "@delead/shared/headers";

config({ path: resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@delead/db", "@delead/brand", "@delead/shared", "@delead/ui"],
  serverExternalPackages: ["postgres"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
};

export default nextConfig;
