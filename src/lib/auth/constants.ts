export { AUTH_ROUTES } from '@/constants/navigation'
export { USER_ROLES } from '@/constants/roles'
export type { UserRole } from '@/constants/roles'

export const AUTH_COOKIE_NAMES = {
  accessToken: 'auth-access-token',
  accessTokenExpiresAt: 'auth-access-token-expires-at',
  refreshToken: 'auth-refresh-token',
  refreshTokenExpiresAt: 'auth-refresh-token-expires-at',
  postLoginRedirect: 'auth-post-login-redirect'
} as const

export const AUTH_HEADERS = {
  sessionExpired: 'x-auth-session-expired'
} as const

export const AUTH_MOCK_USERS = {
  admin: {
    userName: 'admin',
    email: 'admin@plantilla.local',
    password: 'ChangeMe123!',
    role: 'admin'
  },
  user: {
    userName: 'user',
    email: 'user@plantilla.local',
    password: 'ChangeMe123!',
    role: 'user'
  }
} as const

export const AUTH_REFRESH_SKEW_MS = 60_000
