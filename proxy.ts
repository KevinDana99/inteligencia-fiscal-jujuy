import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  clearAuthResponse,
  getRedirectPathByUserType,
  readProxyRequestSession,
  redirectToLogin,
  refreshExpiredRequestSession,
  resolveCurrentUserType
} from '@/lib/auth/proxy-session'
import { AUTH_ROUTES } from '@/lib/auth/constants'
import type { AuthUserType } from '@/lib/auth/proxy-session'

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestSession = readProxyRequestSession(request)
  const hadSessionCookies = Boolean(requestSession)
  const response = NextResponse.next()

  let session = await refreshExpiredRequestSession(requestSession, response)
  let currentUserType: AuthUserType = null

  try {
    currentUserType = await resolveCurrentUserType(session)
  } catch {
    session = null
    currentUserType = null
  }

  if (pathname === AUTH_ROUTES.login) {
    if (session?.accessToken && currentUserType) {
      return redirectTo(request, getRedirectPathByUserType(currentUserType))
    }

    if (hadSessionCookies) {
      return clearAuthResponse(response)
    }

    return response
  }

  if (!session?.accessToken || !currentUserType) {
    return redirectToLogin(request)
  }

  if (pathname === AUTH_ROUTES.admin && currentUserType !== 'SUPER_ADMIN') {
    return redirectTo(request, AUTH_ROUTES.home)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
}
