import { RestUnifiedRegisterSource } from './RestUnifiedRegisterSource';

const ORIGINAL_FETCH = global.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

describe('RestUnifiedRegisterSource', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  it('lists contributors through the unified padron endpoint', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        pagina: 2,
        itemsPagina: 25,
        totalPaginas: 4,
        contribuyentes: [
          {
            id: '06b815b5-b68b-41b9-be4c-10a7cb566c01',
            cuit: '30-12345678-1',
            razonSocial: 'ANOVA SRL',
            actividad: 'Servicios profesionales',
            tipoContribuyente: 'Régimen General',
            activo: true,
            riesgo: 'B'
          }
        ]
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(source.listContributors(2, 25, ' ANOVA ')).resolves.toEqual({
      pagina: 2,
      itemsPagina: 25,
      totalPaginas: 4,
      contribuyentes: [
        {
          contribuyenteId: '06b815b5-b68b-41b9-be4c-10a7cb566c01',
          cuit: '30-12345678-1',
          businessName: 'ANOVA SRL',
          activity: 'Servicios profesionales',
          regime: 'Régimen General',
          status: 'Activo',
          riskLevel: 'B'
        }
      ]
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado?Pagina=2&ItemsPagina=25&Busqueda=ANOVA'
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'GET'
    });
  });
});
