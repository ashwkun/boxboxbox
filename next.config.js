/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

const nextConfig = {
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
    domains: ['image.tmdb.org'],
  },
  // Disable browsing-topics policy - Note: headers don't work with static export
  // but we'll keep this for reference
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  // Turn off features causing issues in static export
  experimental: {
    // Disable CSS optimization as it's causing build issues
    optimizeCss: false,
    scrollRestoration: true,
  },
  // Disable eslint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = withPWA(nextConfig); 