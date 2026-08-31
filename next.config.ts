import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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