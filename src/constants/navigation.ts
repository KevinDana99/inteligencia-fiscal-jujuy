export const APP_ROUTES = {
  login: '/login',
  home: '/',
  admin: '/admin',
  adminSettings: '/admin/configuracion',
  explorerRegister: '/explorar-padron',
  batchManagement: '/gestion-de-lotes',
  crossManagement: '/gestion-de-cruces',
  crossManagementPreview: '/gestion-de-cruces/vista-previa-cruce',
  reprocessing: '/reproceso',
  dashboardSettings: '/configuracion'
} as const

export const AUTH_ROUTES = {
  login: APP_ROUTES.login,
  home: APP_ROUTES.home,
  admin: APP_ROUTES.admin
} as const

export const ADMIN_PANEL_ROUTES = {
  dashboard: APP_ROUTES.admin,
  settings: APP_ROUTES.adminSettings
} as const

export const PRIVATE_DASHBOARD_ROUTES = {
  unifiedRegister: APP_ROUTES.home,
  explorerRegister: APP_ROUTES.explorerRegister,
  batchManagement: APP_ROUTES.batchManagement,
  crossManagement: APP_ROUTES.crossManagement,
  crossManagementPreview: APP_ROUTES.crossManagementPreview,
  reprocessing: APP_ROUTES.reprocessing,
  settings: APP_ROUTES.dashboardSettings
} as const
