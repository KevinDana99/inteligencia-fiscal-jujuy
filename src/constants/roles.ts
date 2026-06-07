export const USER_ROLES = {
  ADMIN: 'SuperAdministrador',
  FISCAL_ANALYST: 'ANALISTA_FISCAL'
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Super Administrador',
  [USER_ROLES.FISCAL_ANALYST]: 'Analista Fiscal'
}

export const DEFAULT_USER_ROLE_LABEL = 'Usuario'
