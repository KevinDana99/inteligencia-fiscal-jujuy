import { RestAdminPanelSource } from '../../../data/sources/rest/RestAdminPanelSource';

describe('deleteAdminUserAction contract', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();
  const usuarioId = '019dbb8f-e390-724b-aaee-e13b1c356532';

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 204
      })
    );
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sends the DELETE request exactly as defined by the contract and handles 204 null', async () => {
    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.deleteAdminUser(usuarioId);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:3000/api/super-administrador/usuarios/${usuarioId}`,
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

  test('rejects non UUID usuarioId before calling the backend', async () => {
    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.deleteAdminUser('test@example.com');

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'El usuarioId debe ser un UUID valido.',
      code: 'super_administrador.usuarios.usuario_id_invalido',
      status: 400
    });
  });
});
