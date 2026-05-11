import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@neondatabase/serverless"],
};

export default nextConfig;
