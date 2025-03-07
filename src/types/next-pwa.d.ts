declare module 'next-pwa' {
  import { NextConfig } from 'next';

  type PWAConfig = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    scope?: string;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: string[] | RegExp[];
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    customWorkerDir?: string;
    dynamicStartUrl?: boolean;
  };

  type WithPWA = (config?: PWAConfig) => (nextConfig?: NextConfig) => NextConfig;

  const withPWA: WithPWA;
  export default withPWA;
} 