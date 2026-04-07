import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  }
};

export default nextConfig;
