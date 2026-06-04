export const ADMIN_PANEL_ROLE_OPTIONS = [
  'Fiscal',
  'Inspectora',
  'Analista',
  'Coordinadora'
] as const

export type AdminPanelRoleOption = (typeof ADMIN_PANEL_ROLE_OPTIONS)[number]
