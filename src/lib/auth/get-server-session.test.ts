import { getServerAuthSession } from './get-server-session';
import type { ISerializedAuthSession } from '@/modules/auth/data/models/Auth';

const mockReadServerAuthSession = jest.fn();
const mockSetServerAuthCookies = jest.fn();
const mockClearServerAuthCookies = jest.fn();
const mockRefreshAuthSession = jest.fn();
const mockGetCurrentContext = jest.fn();
const mockCreateServerAuthSource = jest.fn();

jest.mock('./cookies', () => ({
  readServerAuthSession: (...args: unknown[]) =>
    mockReadServerAuthSession(...args),
  setServerAuthCookies: (...args: unknown[]) => mockSetServerAuthCookies(...args),
  clearServerAuthCookies: (...args: unknown[]) =>
    mockClearServerAuthCookies(...args)
}));

jest.mock('./refresh-session', () => ({
  refreshAuthSession: (...args: unknown[]) => mockRefreshAuthSession(...args)
}));

jest.mock('@/modules/auth/data/data-access', () => ({
  createServerAuthSource: (...args: unknown[]) =>
    mockCreateServerAuthSource(...args)
}));

const NOW = new Date('2026-01-01T00:00:00.000Z');

function buildSession(
  overrides: Partial<ISerializedAuthSession> = {}
): ISerializedAuthSession {
  return {
    accessToken: 'old-access-token',
    accessTokenExpiresAt: new Date(NOW.getTime() + 5 * 60 * 1000).toISOString(),
    refreshToken: 'refresh-token',
    refreshTokenExpiresAt: new Date(NOW.getTime() + 60 * 60 * 1000).toISOString(),
    ...overrides
  };
}

describe('getServerAuthSession refresh behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    mockCreateServerAuthSource.mockResolvedValue({
      getCurrentContext: mockGetCurrentContext
    });
    mockGetCurrentContext.mockResolvedValue({
      autenticado: true,
      esquema: 'Bearer',
      nombreUsuario: 'Analista',
      correo: 'analista@example.com',
      sujeto: 'user-1',
      tipoUsuario: 'ANALISTA_FISCAL'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('force refreshes, stores cookies and returns the refreshed context', async () => {
    const refreshedSession = buildSession({
      accessToken: 'fresh-access-token'
    });

    mockReadServerAuthSession.mockResolvedValue(buildSession());
    mockRefreshAuthSession.mockResolvedValue(refreshedSession);

    await expect(
      getServerAuthSession({ forceRefresh: true })
    ).resolves.toMatchObject({
      accessToken: 'fresh-access-token',
      user: {
        autenticado: true,
        tipoUsuario: 'ANALISTA_FISCAL'
      }
    });

    expect(mockRefreshAuthSession).toHaveBeenCalledWith({
      refrescarToken: 'refresh-token'
    });
    expect(mockSetServerAuthCookies).toHaveBeenCalledWith(refreshedSession);
    expect(mockGetCurrentContext).toHaveBeenCalledWith('fresh-access-token');
  });

  it('refreshes an expired access token while the refresh token is still valid', async () => {
    const refreshedSession = buildSession({
      accessToken: 'fresh-access-token',
      accessTokenExpiresAt: new Date(NOW.getTime() + 5 * 60 * 1000).toISOString()
    });

    mockReadServerAuthSession.mockResolvedValue(
      buildSession({
        accessTokenExpiresAt: new Date(NOW.getTime() - 1).toISOString()
      })
    );
    mockRefreshAuthSession.mockResolvedValue(refreshedSession);

    await expect(getServerAuthSession()).resolves.toMatchObject({
      accessToken: 'fresh-access-token',
      user: {
        autenticado: true,
        tipoUsuario: 'ANALISTA_FISCAL'
      }
    });

    expect(mockRefreshAuthSession).toHaveBeenCalledWith({
      refrescarToken: 'refresh-token'
    });
    expect(mockSetServerAuthCookies).toHaveBeenCalledWith(refreshedSession);
    expect(mockGetCurrentContext).toHaveBeenCalledWith('fresh-access-token');
  });

  it.each([
    ['returns null', () => mockRefreshAuthSession.mockResolvedValue(null)],
    [
      'throws',
      () => mockRefreshAuthSession.mockRejectedValue(new Error('network error'))
    ]
  ])('clears cookies when refresh %s', async (_label, arrange) => {
    mockReadServerAuthSession.mockResolvedValue(
      buildSession({
        accessTokenExpiresAt: new Date(NOW.getTime() - 1).toISOString()
      })
    );
    arrange();

    await expect(getServerAuthSession()).resolves.toBeNull();

    expect(mockClearServerAuthCookies).toHaveBeenCalledTimes(1);
    expect(mockSetServerAuthCookies).not.toHaveBeenCalled();
    expect(mockGetCurrentContext).not.toHaveBeenCalled();
  });

  it('clears cookies when refreshed context cannot be resolved', async () => {
    mockReadServerAuthSession.mockResolvedValue(buildSession());
    mockRefreshAuthSession.mockResolvedValue(
      buildSession({
        accessToken: 'fresh-access-token'
      })
    );
    mockGetCurrentContext.mockRejectedValue(new Error('Unauthorized'));

    await expect(
      getServerAuthSession({ forceRefresh: true })
    ).resolves.toBeNull();

    expect(mockClearServerAuthCookies).toHaveBeenCalledTimes(1);
  });
});
