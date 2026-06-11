import { getJson } from './api-client';

const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

describe('api-client auth retry', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;

    if (typeof ORIGINAL_API_BASE_URL === 'undefined') {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
      return;
    }

    process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_API_BASE_URL;
  });

  it('refreshes the token and retries once after a 401', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ mensaje: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(jsonResponse({ ok: true }, 200));

    const refreshAccessToken = jest.fn().mockResolvedValue('fresh-token');

    await expect(
      getJson('/secure-resource', {
        token: 'old-token',
        refreshAccessToken
      })
    ).resolves.toEqual({ ok: true });

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer old-token'
    );
    expect(fetchMock.mock.calls[1][1].headers.get('Authorization')).toBe(
      'Bearer fresh-token'
    );
  });

  it('keeps the original 401 when the session cannot be refreshed', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ mensaje: 'Unauthorized' }, 401)
    );

    await expect(
      getJson('/secure-resource', {
        token: 'old-token',
        refreshAccessToken: jest.fn().mockResolvedValue(null)
      })
    ).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized'
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry more than once when the refreshed token is rejected', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ mensaje: 'Unauthorized' }, 401))
      .mockResolvedValueOnce(
        jsonResponse({ mensaje: 'Still unauthorized' }, 401)
      );

    await expect(
      getJson('/secure-resource', {
        token: 'old-token',
        refreshAccessToken: jest.fn().mockResolvedValue('fresh-token')
      })
    ).rejects.toMatchObject({
      status: 401,
      message: 'Still unauthorized'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
