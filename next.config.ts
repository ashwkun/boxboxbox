import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['firebase']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
});

export default nextConfig;
