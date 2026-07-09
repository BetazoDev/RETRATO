import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'retrato.local',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'retratowp.halonso.digital',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'contribution.usercontent.google.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
