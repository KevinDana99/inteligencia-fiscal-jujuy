import type { Route } from 'next'

export const DASHBOARD_SECTIONS = {
  PADRON_UNIFICADO: 'padron-unificado',
  EXPLORAR_PADRON: 'explorar-padron',
  GESTION_DE_LOTES: 'gestion-de-lotes',
  GESTION_DE_CRUCES: 'gestion-de-cruces',
  REPROCESO: 'reproceso',
  SETTINGS: 'settings'
} as const

export const DASHBOARD_NAV_GROUPS = {
  ANALYSIS: 'analisis',
  TRACKING: 'seguimiento',
  CUSTOMIZATION: 'personalizacion'
} as const

export const DASHBOARD_NAV_LABELS = {
  PADRON_UNIFICADO: 'Padrón Unificado',
  EXPLORAR_PADRON: 'Explorar Padrón',
  GESTION_DE_LOTES: 'Gestión de Lotes',
  GESTION_DE_CRUCES: 'Gestión de Cruces',
  REPROCESO: 'Reproceso',
  SETTINGS: 'Configuración'
} as const

export const DASHBOARD_NAV_GROUP_LABELS = {
  [DASHBOARD_NAV_GROUPS.ANALYSIS]: 'Análisis',
  [DASHBOARD_NAV_GROUPS.TRACKING]: 'Seguimiento',
  [DASHBOARD_NAV_GROUPS.CUSTOMIZATION]: 'Personalización'
} as const

export const DASHBOARD_ROUTES = {
  PADRON_UNIFICADO: '/',
  EXPLORAR_PADRON: '/explorar-padron',
  GESTION_DE_LOTES: '/gestion-de-lotes',
  GESTION_DE_CRUCES: '/gestion-de-cruces',
  REPROCESO: '/reproceso',
  SETTINGS: '/configuracion'
} as const satisfies Record<keyof typeof DASHBOARD_SECTIONS, Route>

export const DASHBOARD_NAV_ICONS = {
  SEARCH: 'search',
  GRID: 'grid',
  ACTIVITY: 'activity',
  CLOCK: 'clock',
  SETTINGS: 'settings',
  SLIDERS: 'sliders'
} as const

export const DASHBOARD_DEFAULT_PATHNAME = DASHBOARD_ROUTES.PADRON_UNIFICADO
