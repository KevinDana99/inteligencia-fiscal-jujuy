import { RestAdminPanelSource } from '../../../data/sources/rest/RestAdminPanelSource';

describe('updateAdminUserAction contract', () => {
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

  test('sends the PATCH request payload exactly as defined by the contract and handles 204 null', async () => {
    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.updateAdminUser({
      id: usuarioId,
      firstName: 'Carlos',
      lastName: 'Actualizado',
      email: 'carlos.lopez@inteligenciafiscal.local',
      roleLabel: 'Analista'
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:3000/api/super-administrador/usuarios/${usuarioId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-de-prueba'
        },
        body: JSON.stringify({
          nombre: 'Carlos',
          apellido: 'Actualizado',
          correo: 'carlos.lopez@inteligenciafiscal.local',
          cargo: 'Analista',
          nuevaContrasena: null,
          confirmarContrasena: null
        })
      }
    );

    expect(result).toEqual({
      success: true
    });
  });
});
