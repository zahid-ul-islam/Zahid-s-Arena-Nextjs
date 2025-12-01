import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // @ts-expect-error - eslint property exists but not in type definition
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
