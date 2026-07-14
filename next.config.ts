import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'retratowp.halonso.digital',
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
  // Experimental: Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['next/dist/client'],
  },
};

export default nextConfig;
