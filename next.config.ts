import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.local',
    '*.localdomain',
    '192.168.*.*',
    '10.*.*.*',
    '172.*.*.*',
    '*.ngrok-free.app'
  ]
}

export default nextConfig
