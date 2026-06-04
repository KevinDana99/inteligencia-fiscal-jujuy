import { RestAdminPanelSource } from '../../../data/sources/rest/RestAdminPanelSource';

describe('createAdminUserAction contract', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('sends the POST request payload exactly as defined by the contract and handles 200 empty bodies', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 200
      })
    );

    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.createAdminUser({
      firstName: 'Carlos',
      lastName: 'Lopez',
      email: 'carlos.lopez@inteligenciafiscal.local',
      roleLabel: 'Analista',
      password: 'Admin123!Local',
      confirmPassword: 'Admin123!Local'
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, requestInit] = fetchMock.mock.calls[0] ?? [];

    expect(url).toBe('http://localhost:3000/api/super-administrador/usuarios');
    expect(requestInit).toMatchObject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-de-prueba'
      }
    });
    expect(JSON.parse(String(requestInit?.body))).toEqual({
      nombre: 'Carlos',
      apellido: 'Lopez',
      correo: 'carlos.lopez@inteligenciafiscal.local',
      cargo: 'Analista',
      contrasena: 'Admin123!Local',
      confirmarContrasena: 'Admin123!Local'
    });

    expect(result).toEqual({
      success: true
    });
  });

  test('returns ASP.NET validation errors when the backend rejects the payload', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          title: 'One or more validation errors occurred.',
          status: 400,
          errors: {
            ConfirmarContrasena: ['The ConfirmarContrasena field is required.']
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );

    const source = new RestAdminPanelSource({
      baseUrl: 'http://localhost:3000',
      token: 'token-de-prueba'
    });

    const result = await source.createAdminUser({
      firstName: 'Carlos',
      lastName: 'Lopez',
      email: 'carlos.lopez@inteligenciafiscal.local',
      roleLabel: 'Analista',
      password: 'Admin123!Local',
      confirmPassword: ''
    });

    expect(result).toEqual({
      success: false,
      error: 'The ConfirmarContrasena field is required.',
      code: undefined,
      status: 400
    });
  });
});
