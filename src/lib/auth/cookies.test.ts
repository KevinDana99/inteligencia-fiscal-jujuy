import type { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAMES } from './constants';
import { setResponseAuthCookies } from './cookies';
import type { ISerializedAuthSession } from '@/modules/auth/data/models/Auth';

function buildSession(): ISerializedAuthSession {
  return {
    accessToken: 'access-token',
    accessTokenExpiresAt: '2026-01-01T00:05:00.000Z',
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: '2026-01-08T00:00:00.000Z'
  };
}

describe('auth cookies', () => {
  it('keeps access token cookies alive until the refresh token expires', () => {
    const cookieSet = jest.fn();
    const response = {
      cookies: {
        set: cookieSet
      }
    } as unknown as NextResponse;
    const session = buildSession();

    setResponseAuthCookies(response, session);

    const cookiesByName = Object.fromEntries(
      cookieSet.mock.calls.map(([name, value, options]) => [
        name,
        { value, options }
      ])
    ) as Record<
      string,
      {
        value: string;
        options: { expires: Date };
      }
    >;
    const refreshTokenExpiresAt = new Date(session.refreshTokenExpiresAt);

    expect(cookiesByName[AUTH_COOKIE_NAMES.accessToken]).toMatchObject({
      value: session.accessToken,
      options: { expires: refreshTokenExpiresAt }
    });
    expect(cookiesByName[AUTH_COOKIE_NAMES.accessTokenExpiresAt]).toMatchObject(
      {
        value: session.accessTokenExpiresAt,
        options: { expires: refreshTokenExpiresAt }
      }
    );
    expect(cookiesByName[AUTH_COOKIE_NAMES.refreshToken]).toMatchObject({
      value: session.refreshToken,
      options: { expires: refreshTokenExpiresAt }
    });
    expect(cookiesByName[AUTH_COOKIE_NAMES.refreshTokenExpiresAt]).toMatchObject(
      {
        value: session.refreshTokenExpiresAt,
        options: { expires: refreshTokenExpiresAt }
      }
    );
  });
});
