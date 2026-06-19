import { NextRequest, NextResponse } from 'next/server'
import {
  clearResponseAuthCookies,
  readRequestAuthSession,
  setResponseAuthCookies
} from './cookies'
import { AUTH_COOKIE_NAMES, AUTH_HEADERS, AUTH_ROUTES, USER_ROLES } from './constants'
import { refreshAuthSession } from './refresh-session'
import { isPostLoginRedirectPath } from './route-access'
import {
  AUTH_SESSION_EXPIRED_NOTICE_COOKIE,
  AUTH_SESSION_EXPIRED_NOTICE_MAX_AGE
} from './session-expired-notice'
import {
  isSessionExpired,
  isSessionExpiredOrWithinSkew,
  mapIamCurrentContextResponseToAuthUser
} from './session-mapper'
import { createServerAuthSource } from '@/modules/auth/data/data-access'
import type {
  IAuthUser,
  ISerializedAuthSession
} from '@/modules/auth/data/models/Auth'

export type AuthUserType = IAuthUser['tipoUsuario']

export interface RefreshExpiredRequestSessionResult {
  session: ISerializedAuthSession | null
  refreshed: boolean
}

export function readProxyRequestSession(
  request: NextRequest
): ISerializedAuthSession | null {
  return readRequestAuthSession(request)
}

export function clearAuthResponse(response: NextResponse): NextResponse {
  clearResponseAuthCookies(response)
  return response
}

export function applySessionToResponse(
  response: NextResponse,
  session: ISerializedAuthSession
): NextResponse {
  setResponseAuthCookies(response, session)
  return response
}

export function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL(AUTH_ROUTES.login, request.url)
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const response = NextResponse.redirect(loginUrl)

  if (isPostLoginRedirectPath(nextPath)) {
    response.cookies.set(AUTH_COOKIE_NAMES.postLoginRedirect, nextPath, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 5
    })
  }

  response.cookies.set(AUTH_SESSION_EXPIRED_NOTICE_COOKIE, '1', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: AUTH_SESSION_EXPIRED_NOTICE_MAX_AGE
  })
  response.headers.set(AUTH_HEADERS.sessionExpired, 'true')
  return clearAuthResponse(response)
}

export function getRedirectPathByUserType(userType: AuthUserType): string {
  return userType === USER_ROLES.ADMIN ? AUTH_ROUTES.admin : AUTH_ROUTES.home
}

function serializeRequestCookies(
  requestHeaders: Headers,
  session: ISerializedAuthSession
) {
  const cookiePairs = new Map<string, string>()
  const currentCookieHeader = requestHeaders.get('cookie') ?? ''

  for (const cookiePair of currentCookieHeader.split(';')) {
    const [name, ...valueParts] = cookiePair.trim().split('=')

    if (!name) {
      continue
    }

    cookiePairs.set(name, valueParts.join('='))
  }

  cookiePairs.set(AUTH_COOKIE_NAMES.accessToken, session.accessToken)
  cookiePairs.set(
    AUTH_COOKIE_NAMES.accessTokenExpiresAt,
    session.accessTokenExpiresAt
  )
  cookiePairs.set(AUTH_COOKIE_NAMES.refreshToken, session.refreshToken)
  cookiePairs.set(
    AUTH_COOKIE_NAMES.refreshTokenExpiresAt,
    session.refreshTokenExpiresAt
  )

  return Array.from(cookiePairs.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

export function applySessionToRequestHeaders(
  requestHeaders: Headers,
  session: ISerializedAuthSession
) {
  requestHeaders.set('cookie', serializeRequestCookies(requestHeaders, session))
}

export async function refreshExpiredRequestSession(
  session: ISerializedAuthSession | null
): Promise<RefreshExpiredRequestSessionResult> {
  if (
    !session?.accessToken ||
    !isSessionExpiredOrWithinSkew(session.accessTokenExpiresAt)
  ) {
    return { session, refreshed: false }
  }

  if (
    !session.refreshToken ||
    isSessionExpired(session.refreshTokenExpiresAt)
  ) {
    return { session: null, refreshed: false }
  }

  let refreshedSession: ISerializedAuthSession | null

  try {
    refreshedSession = await refreshAuthSession({
      refrescarToken: session.refreshToken
    })
  } catch {
    return { session: null, refreshed: false }
  }

  if (!refreshedSession) {
    return { session: null, refreshed: false }
  }

  return { session: refreshedSession, refreshed: true }
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
