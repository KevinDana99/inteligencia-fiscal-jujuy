import { refreshAuthSession } from './refresh-session';

const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ORIGINAL_USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
const NOW = new Date('2026-01-01T00:00:00.000Z');

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

describe('refreshAuthSession', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test';
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH = 'false';
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = ORIGINAL_FETCH;

    if (typeof ORIGINAL_API_BASE_URL === 'undefined') {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_API_BASE_URL;
    }

    if (typeof ORIGINAL_USE_MOCK_AUTH === 'undefined') {
      delete process.env.NEXT_PUBLIC_USE_MOCK_AUTH;
    } else {
      process.env.NEXT_PUBLIC_USE_MOCK_AUTH = ORIGINAL_USE_MOCK_AUTH;
    }
  });

  it('maps a successful refresh response to a serialized session', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          token: 'fresh-access-token',
          expiraEn: 300,
          refrescarToken: 'fresh-refresh-token',
          refrescarTokenExpiraEn: 60 * 60 * 24 * 7,
          usuario: {
            nombreUsuario: 'Analista',
            correo: 'analista@example.com'
          }
        },
        200
      )
    );

    await expect(
      refreshAuthSession({ refrescarToken: 'refresh-token' })
    ).resolves.toEqual({
      accessToken: 'fresh-access-token',
      accessTokenExpiresAt: new Date(
        NOW.getTime() + 300 * 1000
      ).toISOString(),
      refreshToken: 'fresh-refresh-token',
      refreshTokenExpiresAt: new Date(
        NOW.getTime() + 60 * 60 * 24 * 7 * 1000
      ).toISOString()
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/api/iam/autenticacion/renovar-sesion',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refrescarToken: 'refresh-token' })
      })
    );
  });

  it('returns null when the refresh request fails at the network layer', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network error'));

    await expect(
      refreshAuthSession({ refrescarToken: 'refresh-token' })
    ).resolves.toBeNull();
  });

  it('returns null when the refresh endpoint rejects the token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ mensaje: 'Unauthorized' }, 401));

    await expect(
      refreshAuthSession({ refrescarToken: 'refresh-token' })
    ).resolves.toBeNull();
  });

  it('returns null when the refresh endpoint returns invalid JSON', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('not-json', {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    await expect(
      refreshAuthSession({ refrescarToken: 'refresh-token' })
    ).resolves.toBeNull();
  });
});
