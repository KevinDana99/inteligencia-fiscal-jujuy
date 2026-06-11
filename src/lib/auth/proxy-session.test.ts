import { AUTH_COOKIE_NAMES } from './constants';
import {
  applySessionToRequestHeaders,
  refreshExpiredRequestSession
} from './proxy-session';
import type { ISerializedAuthSession } from '@/modules/auth/data/models/Auth';

const mockRefreshAuthSession = jest.fn();

jest.mock('./refresh-session', () => ({
  refreshAuthSession: (...args: unknown[]) => mockRefreshAuthSession(...args)
}));

const NOW = new Date('2026-01-01T00:00:00.000Z');

function buildSession(
  overrides: Partial<ISerializedAuthSession> = {}
): ISerializedAuthSession {
  return {
    accessToken: 'old-access-token',
    accessTokenExpiresAt: new Date(NOW.getTime() + 30_000).toISOString(),
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: new Date(NOW.getTime() + 60 * 60 * 1000).toISOString(),
    ...overrides
  };
}

describe('proxy-session refresh behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('refreshes sessions inside the access token skew', async () => {
    const refreshedSession = buildSession({
      accessToken: 'fresh-access-token',
      accessTokenExpiresAt: new Date(NOW.getTime() + 5 * 60 * 1000).toISOString()
    });

    mockRefreshAuthSession.mockResolvedValue(refreshedSession);

    await expect(refreshExpiredRequestSession(buildSession())).resolves.toEqual({
      session: refreshedSession,
      refreshed: true
    });

    expect(mockRefreshAuthSession).toHaveBeenCalledWith({
      refrescarToken: 'refresh-token'
    });
  });

  it('does not refresh when the refresh token is expired', async () => {
    await expect(
      refreshExpiredRequestSession(
        buildSession({
          accessTokenExpiresAt: new Date(NOW.getTime() - 1).toISOString(),
          refreshTokenExpiresAt: new Date(NOW.getTime() - 1).toISOString()
        })
      )
    ).resolves.toEqual({
      session: null,
      refreshed: false
    });

    expect(mockRefreshAuthSession).not.toHaveBeenCalled();
  });

  it('writes refreshed cookies into downstream request headers', () => {
    const headers = new Headers({
      cookie: `${AUTH_COOKIE_NAMES.accessToken}=old-access-token; theme=dark`
    });

    applySessionToRequestHeaders(
      headers,
      buildSession({
        accessToken: 'fresh-access-token',
        refreshToken: 'fresh-refresh-token'
      })
    );

    expect(headers.get('cookie')).toContain(
      `${AUTH_COOKIE_NAMES.accessToken}=fresh-access-token`
    );
    expect(headers.get('cookie')).toContain(
      `${AUTH_COOKIE_NAMES.refreshToken}=fresh-refresh-token`
    );
    expect(headers.get('cookie')).toContain('theme=dark');
  });
});
