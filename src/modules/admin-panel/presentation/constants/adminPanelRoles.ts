export const ADMIN_PANEL_ROLE_OPTIONS = [
  'Fiscal',
  'Inspector',
  'Analista',
  'Coordinador'
] as const

export type AdminPanelRoleOption = (typeof ADMIN_PANEL_ROLE_OPTIONS)[number]
