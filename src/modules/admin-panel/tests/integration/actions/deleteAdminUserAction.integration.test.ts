import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { RestAdminPanelSource } from '../../../data/sources/rest/RestAdminPanelSource';

describe('deleteAdminUserAction contract', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = mock();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sends the DELETE request exactly as defined by the contract and handles 204 null', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 204
      })
    );

    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.deleteAdminUser('carlos-gomez');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/super-administrador/usuarios/carlos-gomez',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-de-prueba'
        }
      }
    );

    expect(result).toEqual({
      success: true
    });
  });
});
