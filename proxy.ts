import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  clearAuthResponse,
  readProxyRequestSession,
  redirectToLogin,
  refreshExpiredRequestSession,
  resolveCurrentUserType
} from '@/lib/auth/proxy-session'
import { AUTH_ROUTES, USER_ROLES } from '@/lib/auth/constants'
import { getProtectedRouteRedirect, isLoginRoute } from '@/lib/auth/route-access'
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

  if (isLoginRoute(pathname)) {
    if (session?.accessToken && currentUserType) {
      return redirectTo(
        request,
        currentUserType === USER_ROLES.ADMIN
          ? AUTH_ROUTES.admin
          : AUTH_ROUTES.home
      )
    }

    if (hadSessionCookies) {
      return clearAuthResponse(response)
    }

    return response
  }

  if (!session?.accessToken || !currentUserType) {
    return redirectToLogin(request)
  }

  const protectedRouteRedirect = getProtectedRouteRedirect(
    pathname,
    currentUserType
  )

  if (protectedRouteRedirect) {
    return redirectTo(request, protectedRouteRedirect)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
}
