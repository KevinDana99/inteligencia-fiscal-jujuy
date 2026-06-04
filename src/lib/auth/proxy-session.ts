import { NextRequest, NextResponse } from 'next/server'
import {
  clearResponseAuthCookies,
  readRequestAuthSession,
  setResponseAuthCookies
} from './cookies'
import { AUTH_COOKIE_NAMES, AUTH_HEADERS, AUTH_ROUTES, USER_ROLES } from './constants'
import { refreshAuthSession } from './refresh-session'
import {
  isSessionExpired,
  mapIamCurrentContextResponseToAuthUser
} from './session-mapper'
import { createServerAuthSource } from '@/modules/auth/data/data-access'
import type {
  IAuthUser,
  ISerializedAuthSession
} from '@/modules/auth/data/models/Auth'

export type AuthUserType = IAuthUser['tipoUsuario']

export function readProxyRequestSession(
  request: NextRequest
): ISerializedAuthSession | null {
  return readRequestAuthSession(request)
}

export function clearAuthResponse(response: NextResponse): NextResponse {
  clearResponseAuthCookies(response)
  return response
}

export function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(AUTH_ROUTES.login, request.url)
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const response = NextResponse.redirect(loginUrl)
  response.cookies.set(AUTH_COOKIE_NAMES.postLoginRedirect, nextPath, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5
  })
  response.headers.set(AUTH_HEADERS.sessionExpired, 'true')
  return clearAuthResponse(response)
}

export function getRedirectPathByUserType(userType: AuthUserType): string {
  return userType === USER_ROLES.ADMIN ? AUTH_ROUTES.admin : AUTH_ROUTES.home
}

export async function refreshExpiredRequestSession(
  session: ISerializedAuthSession | null,
  response: NextResponse
): Promise<ISerializedAuthSession | null> {
  if (
    !session?.accessToken ||
    !isSessionExpired(session.accessTokenExpiresAt)
  ) {
    return session
  }

  if (
    !session.refreshToken ||
    isSessionExpired(session.refreshTokenExpiresAt)
  ) {
    return null
  }

  const refreshedSession = await refreshAuthSession({
    refrescarToken: session.refreshToken
  })

  if (!refreshedSession) {
    return null
  }

  setResponseAuthCookies(response, refreshedSession)
  return refreshedSession
}

export async function resolveCurrentUserType(
  session: ISerializedAuthSession | null
): Promise<AuthUserType> {
  if (!session?.accessToken) {
    return null
  }

  const source = await createServerAuthSource()
  const context = await source.getCurrentContext(session.accessToken)
  return mapIamCurrentContextResponseToAuthUser(context).tipoUsuario
}
