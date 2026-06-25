import type { Metadata, Viewport } from 'next'
import { APP_ROUTES } from './navigation'

const DEFAULT_METADATA_BASE = 'http://localhost:3000'

export const APP_METADATA = {
  name: 'Inteligencia Fiscal',
  fullName: 'Inteligencia Fiscal - Jujuy',
  shortName: 'IF Jujuy',
  description:
    'Plataforma de la Dirección Provincial de Rentas de Jujuy para análisis, cruces, padrones y gestión fiscal.',
  locale: 'es_AR',
  manifestPath: '/manifest.webmanifest',
  iconPath: '/favicon.ico',
  logoPath: '/assets/branding/logo-mini.svg',
  themeColor: '#1c7ed6'
} as const

function resolveMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

  if (!configuredUrl) {
    return new URL(DEFAULT_METADATA_BASE)
  }

  try {
    return new URL(configuredUrl)
  } catch {
    return new URL(DEFAULT_METADATA_BASE)
  }
}

function formatPageTitle(title: string) {
  return `${title} | ${APP_METADATA.name}`
}

export function buildPageMetadata({
  title,
  description,
  path
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const socialTitle = formatPageTitle(title)

  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: APP_METADATA.fullName,
      locale: APP_METADATA.locale,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: socialTitle,
      description
    }
  }
}

export const DEFAULT_METADATA: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: APP_METADATA.fullName,
    template: `%s | ${APP_METADATA.name}`
  },
  description: APP_METADATA.description,
  applicationName: APP_METADATA.name,
  referrer: 'origin-when-cross-origin',
  manifest: APP_METADATA.manifestPath,
  alternates: {
    canonical: APP_ROUTES.home
  },
  icons: {
    icon: [
      {
        url: APP_METADATA.iconPath,
        sizes: 'any'
      },
      {
        url: APP_METADATA.logoPath,
        type: 'image/svg+xml'
      }
    ],
    shortcut: APP_METADATA.iconPath
  },
  openGraph: {
    title: APP_METADATA.fullName,
    description: APP_METADATA.description,
    url: APP_ROUTES.home,
    siteName: APP_METADATA.fullName,
    locale: APP_METADATA.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: APP_METADATA.fullName,
    description: APP_METADATA.description
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  },
  formatDetection: {
    telephone: false
  },
  appleWebApp: {
    capable: true,
    title: APP_METADATA.shortName,
    statusBarStyle: 'default'
  },
  category: 'government'
}

export const APP_VIEWPORT: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: APP_METADATA.themeColor
}

export const PAGE_METADATA = {
  login: buildPageMetadata({
    title: 'Login',
    description: 'Acceso seguro a la plataforma de Inteligencia Fiscal.',
    path: APP_ROUTES.login
  }),
  unifiedRegister: buildPageMetadata({
    title: 'Padrón unificado',
    description:
      'Consulta integral de contribuyentes, indicadores fiscales y actividad registrada.',
    path: APP_ROUTES.home
  }),
  explorerRegister: buildPageMetadata({
    title: 'Explorar padrón',
    description:
      'Exploración y selección de contribuyentes para análisis fiscal.',
    path: APP_ROUTES.explorerRegister
  }),
  batchManagement: buildPageMetadata({
    title: 'Gestión de lotes',
    description:
      'Administración de lotes de CUITs para cruces y revisiones fiscales.',
    path: APP_ROUTES.batchManagement
  }),
  crossManagement: buildPageMetadata({
    title: 'Gestión de cruces',
    description:
      'Seguimiento de cruces fiscales, ejecuciones y resultados de análisis.',
    path: APP_ROUTES.crossManagement
  }),
  reprocessing: buildPageMetadata({
    title: 'Reproceso',
    description:
      'Seguimiento de contribuyentes enviados a reproceso y revisión operativa.',
    path: APP_ROUTES.reprocessing
  }),
  dashboardSettings: buildPageMetadata({
    title: 'Configuración',
    description:
      'Configuración de plantillas y parámetros operativos del dashboard fiscal.',
    path: APP_ROUTES.dashboardSettings
  }),
  admin: buildPageMetadata({
    title: 'Panel de administración',
    description:
      'Gestión de usuarios, permisos y controles administrativos del sistema.',
    path: APP_ROUTES.admin
  }),
  adminSettings: buildPageMetadata({
    title: 'Configuración administrativa',
    description:
      'Administración de parámetros generales y dominios permitidos.',
    path: APP_ROUTES.adminSettings
  })
} as const

export function buildCrossPreviewMetadata(crossId: string) {
  const decodedCrossId = decodeURIComponent(crossId)

  return buildPageMetadata({
    title: `Vista previa de cruce ${decodedCrossId}`,
    description:
      'Revisión de planilla, resumen y resultados del cruce fiscal seleccionado.',
    path: `${APP_ROUTES.crossManagementPreview}/${encodeURIComponent(decodedCrossId)}`
  })
}

export function buildUnifiedRegisterPreviewMetadata(cuit: string) {
  const decodedCuit = decodeURIComponent(cuit)

  return buildPageMetadata({
    title: `Vista previa de padrón ${decodedCuit}`,
    description:
      'Ficha fiscal del contribuyente con datos de padrón, actividades, cruces y documentación.',
    path: `/vista-previa-padron/${encodeURIComponent(decodedCuit)}`
  })
}
