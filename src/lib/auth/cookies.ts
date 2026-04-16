import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES } from './constants';
import {
  mapSerializedSessionToAuthSession,
  serializeAuthSession
} from './session-mapper';
import type { IAuthSession, ISerializedAuthSession } from '@/modules/auth/data/models/Auth';

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
  const userName = requestCookies.get(AUTH_COOKIE_NAMES.userName)?.value;
  const email = requestCookies.get(AUTH_COOKIE_NAMES.userEmail)?.value;

  if (
    !accessToken ||
    !accessTokenExpiresAt ||
    !refreshToken ||
    !refreshTokenExpiresAt ||
    !userName ||
    !email
  ) {
    return null;
  }

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    userName,
    email
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

export async function readServerAuthSession(): Promise<IAuthSession | null> {
  const cookieStore = await cookies();
  return mapSerializedSessionToAuthSession(buildSerializedSession(cookieStore));
}

export function readRequestAuthSession(request: NextRequest): IAuthSession | null {
  return mapSerializedSessionToAuthSession(buildSerializedSession(request.cookies));
}

export async function setServerAuthCookies(session: IAuthSession): Promise<void> {
  const cookieStore = await cookies();
  const serializedSession = serializeAuthSession(session);

  if (!serializedSession) {
    return;
  }

  cookieStore.set(
    AUTH_COOKIE_NAMES.accessToken,
    serializedSession.accessToken,
    applyCookieOptions(serializedSession.accessTokenExpiresAt)
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.accessTokenExpiresAt,
    serializedSession.accessTokenExpiresAt,
    applyCookieOptions(serializedSession.accessTokenExpiresAt)
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.refreshToken,
    serializedSession.refreshToken,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.refreshTokenExpiresAt,
    serializedSession.refreshTokenExpiresAt,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.userName,
    serializedSession.userName,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  cookieStore.set(
    AUTH_COOKIE_NAMES.userEmail,
    serializedSession.email,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
}

export async function clearServerAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  for (const cookieName of Object.values(AUTH_COOKIE_NAMES)) {
    cookieStore.delete(cookieName);
  }
}

export function setResponseAuthCookies(
  response: NextResponse,
  session: IAuthSession
): void {
  const serializedSession = serializeAuthSession(session);

  if (!serializedSession) {
    return;
  }

  response.cookies.set(
    AUTH_COOKIE_NAMES.accessToken,
    serializedSession.accessToken,
    applyCookieOptions(serializedSession.accessTokenExpiresAt)
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.accessTokenExpiresAt,
    serializedSession.accessTokenExpiresAt,
    applyCookieOptions(serializedSession.accessTokenExpiresAt)
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.refreshToken,
    serializedSession.refreshToken,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.refreshTokenExpiresAt,
    serializedSession.refreshTokenExpiresAt,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.userName,
    serializedSession.userName,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.userEmail,
    serializedSession.email,
    applyCookieOptions(serializedSession.refreshTokenExpiresAt)
  );
}

export function clearResponseAuthCookies(response: NextResponse): void {
  for (const cookieName of Object.values(AUTH_COOKIE_NAMES)) {
    response.cookies.delete(cookieName);
  }
}
