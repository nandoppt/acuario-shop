import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.8.17"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcroxwbgrqtenhdxqptc.supabase.co",
      },
    ],
  },
};

export default nextConfig;