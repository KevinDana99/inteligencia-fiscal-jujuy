import type { MetadataRoute } from 'next'
import { APP_METADATA } from '@/constants/metadata'
import { APP_ROUTES } from '@/constants/navigation'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_METADATA.fullName,
    short_name: APP_METADATA.shortName,
    description: APP_METADATA.description,
    start_url: APP_ROUTES.login,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: APP_METADATA.themeColor,
    lang: 'es-AR',
    orientation: 'portrait',
    icons: [
      {
        src: APP_METADATA.iconPath,
        sizes: '32x32 48x48',
        type: 'image/x-icon'
      },
      {
        src: APP_METADATA.logoPath,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  }
}
