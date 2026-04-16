import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  clearResponseAuthCookies,
  readRequestAuthSession,
  setResponseAuthCookies
} from '@/lib/auth/cookies';
import {
  AUTH_MODE,
  AUTH_HEADERS,
  AUTH_REFRESH_SAFETY_WINDOW_MS,
  AUTH_ROUTES
} from '@/lib/auth/constants';
import { refreshAuthSession } from '@/lib/auth/refresh-session';
import { isSessionExpired } from '@/lib/auth/session-mapper';

function isPrivatePath(pathname: string): boolean {
  return pathname !== AUTH_ROUTES.login;
}

function isRefreshWindowValid(expiresAt?: string): boolean {
  if (!expiresAt) {
    return false;
  }

  return Date.parse(expiresAt) > Date.now() + AUTH_REFRESH_SAFETY_WINDOW_MS;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const mode = request.nextUrl.searchParams.get('mode') ?? AUTH_MODE.user;
  const session = readRequestAuthSession(request);
  const hasValidAccessToken =
    !!session?.accessToken && !isSessionExpired(session.accessTokenExpiresAt);

  if (pathname === AUTH_ROUTES.login && hasValidAccessToken) {
    if (mode === AUTH_MODE.admin) {
      if (session?.user.role === 'admin') {
        return NextResponse.redirect(new URL(AUTH_ROUTES.admin, request.url));
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(AUTH_ROUTES.home, request.url));
  }

  if (!isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  if (pathname === AUTH_ROUTES.admin && hasValidAccessToken) {
    if (session?.user.role === 'admin') {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(`${AUTH_ROUTES.login}?mode=${AUTH_MODE.admin}`, request.url)
    );
  }

  if (hasValidAccessToken) {
    return NextResponse.next();
  }

  const canRefresh =
    !!session?.refreshToken && isRefreshWindowValid(session.refreshTokenExpiresAt);

  if (canRefresh && session) {
    const refreshToken = session.refreshToken;

    if (!refreshToken) {
      const response = NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
      response.headers.set(AUTH_HEADERS.sessionExpired, 'true');
      clearResponseAuthCookies(response);
      return response;
    }

    const refreshedSession = await refreshAuthSession({
      refrescarToken: refreshToken,
      email: session.user.email,
      userName: session.user.userName
    });

    if (refreshedSession) {
      if (pathname === AUTH_ROUTES.admin && refreshedSession.user.role !== 'admin') {
        const response = NextResponse.redirect(
          new URL(`${AUTH_ROUTES.login}?mode=${AUTH_MODE.admin}`, request.url)
        );
        setResponseAuthCookies(response, refreshedSession);
        return response;
      }

      const response = NextResponse.next();
      setResponseAuthCookies(response, refreshedSession);
      return response;
    }
  }

  const response = NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
  response.headers.set(AUTH_HEADERS.sessionExpired, 'true');
  clearResponseAuthCookies(response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
