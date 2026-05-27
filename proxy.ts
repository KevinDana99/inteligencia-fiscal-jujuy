import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  clearResponseAuthCookies,
  readRequestAuthSession
} from '@/lib/auth/cookies';
import {
  AUTH_HEADERS,
  AUTH_ROUTES
} from '@/lib/auth/constants';
import { isSessionExpired } from '@/lib/auth/session-mapper';

function isPrivatePath(pathname: string): boolean {
  return pathname !== AUTH_ROUTES.login && pathname !== AUTH_ROUTES.admin;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readRequestAuthSession(request);
  const hasValidAccessToken =
    !!session?.accessToken && !isSessionExpired(session.accessTokenExpiresAt);

  if (pathname === AUTH_ROUTES.login && hasValidAccessToken) {
    return NextResponse.redirect(
      new URL(
        session?.user.role === 'admin' ? AUTH_ROUTES.admin : AUTH_ROUTES.home,
        request.url
      )
    );
  }

  if (!isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  if (hasValidAccessToken) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
  response.headers.set(AUTH_HEADERS.sessionExpired, 'true');
  clearResponseAuthCookies(response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)']
};
