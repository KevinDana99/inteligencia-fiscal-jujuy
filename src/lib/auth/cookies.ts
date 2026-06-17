import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES } from './constants';
import type { ISerializedAuthSession } from '@/modules/auth/data/models/Auth';

const AUTH_SESSION_COOKIE_NAMES = [
  AUTH_COOKIE_NAMES.accessToken,
  AUTH_COOKIE_NAMES.accessTokenExpiresAt,
  AUTH_COOKIE_NAMES.refreshToken,
  AUTH_COOKIE_NAMES.refreshTokenExpiresAt
] as const;

function buildSerializedSession(
  requestCookies: Pick<NextRequest['cookies'], 'get'> | Awaited<ReturnType<typeof cookies>>
): ISerializedAuthSession | null {
  const accessToken = requestCookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;
  const accessTokenExpiresAt = requestCookies.get(
    AUTH_COOKIE_NAMES.accessTokenExpiresAt
  )?.value;
  const refreshToken = requestCookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;
  const refreshTokenExpiresAt = requestCookies.get(
    AUTH_COOKIE_NAMES.refreshTokenExpiresAt
  )?.value;

  if (
    !accessToken ||
    !accessTokenExpiresAt ||
    !refreshToken ||
    !refreshTokenExpiresAt
  ) {
    return null;
  }

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt
  };
}

function applyCookieOptions(expiresAt: string) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt)
  };
}

function setAuthCookies(
  cookieStore: Pick<Awaited<ReturnType<typeof cookies>>, 'set'>,
  session: ISerializedAuthSession
) {
  const refreshTokenCookieOptions = applyCookieOptions(
    session.refreshTokenExpiresAt
  );

  cookieStore.set(
    AUTH_COOKIE_NAMES.accessToken,
    session.accessToken,
    refreshTokenCookieOptions
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.accessTokenExpiresAt,
    session.accessTokenExpiresAt,
    refreshTokenCookieOptions
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.refreshToken,
    session.refreshToken,
    refreshTokenCookieOptions
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.refreshTokenExpiresAt,
    session.refreshTokenExpiresAt,
    refreshTokenCookieOptions
  );
}

function clearAuthCookies(
  cookieStore:
    | Pick<Awaited<ReturnType<typeof cookies>>, 'delete'>
    | Pick<NextResponse['cookies'], 'delete'>
) {
  for (const cookieName of AUTH_SESSION_COOKIE_NAMES) {
    cookieStore.delete({
      name: cookieName,
      path: '/'
    });
  }
}

export async function readServerAuthSession(): Promise<ISerializedAuthSession | null> {
  const cookieStore = await cookies();
  return buildSerializedSession(cookieStore);
}

export function readRequestAuthSession(
  request: NextRequest
): ISerializedAuthSession | null {
  return buildSerializedSession(request.cookies);
}

export async function setServerAuthCookies(
  session: ISerializedAuthSession
): Promise<void> {
  const cookieStore = await cookies();
  setAuthCookies(cookieStore, session);
}

export async function clearServerAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  clearAuthCookies(cookieStore);
}

export function setResponseAuthCookies(
  response: NextResponse,
  session: ISerializedAuthSession
): void {
  setAuthCookies(response.cookies, session);
}

export function clearResponseAuthCookies(response: NextResponse): void {
  clearAuthCookies(response.cookies);
}
