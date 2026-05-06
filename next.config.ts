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
    '*.ngrok-free.app',
    'app.rentas-if.dev.local',
    '192.168.119.106'
  ]
}

export default nextConfig
