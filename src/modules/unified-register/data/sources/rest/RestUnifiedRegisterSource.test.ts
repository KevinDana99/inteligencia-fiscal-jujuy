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

  it('gets contributor header through the unified padron detail endpoint', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        cuit: '30712345671',
        razonSocial: null,
        activo: true,
        tipoContribuyente: 'CONVENIO',
        cantidadLotes: 2,
        actividadPrimaria: {
          nombre: 'DESARROLLO DE SOFTWARE',
          numero: '620100'
        },
        actividadSecundaria: null,
        inicioActividad: null,
        domicilios: {
          fiscal: null
        },
        biDeclarada: null,
        impuestosDeclarados: '120.05',
        deuda: null,
        declaracionesJuradas: {
          presentadas: 1,
          noPresentadas: 0
        },
        riesgo: 'D'
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(source.getContributorHeader('contributor-1')).resolves.toEqual({
      cuit: '30712345671',
      razonSocial: null,
      activo: true,
      tipoContribuyente: 'Convenio Multilateral',
      cantidadLotes: 2,
      actividadPrimaria: {
        nombre: 'DESARROLLO DE SOFTWARE',
        numero: '620100'
      },
      actividadSecundaria: null,
      inicioActividad: null,
      domicilios: {
        fiscal: null
      },
      biDeclarada: null,
      impuestosDeclarados: '120.05',
      deuda: null,
      declaracionesJuradas: {
        presentadas: 1,
        noPresentadas: 0
      },
      riesgo: 'D'
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/encabezado'
    );
  });

  it('lists Mercurio fines with detail pagination query params', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        pagina: 1,
        itemsPagina: 20,
        totalItems: 1,
        totalPaginas: 1,
        multas: [
          {
            numero: null,
            fecha: null,
            descripcion: null,
            monto: '1500.25',
            estado: null
          }
        ]
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(source.listMercurioFines('contributor-1')).resolves.toEqual({
      pagina: 1,
      itemsPagina: 20,
      totalItems: 1,
      totalPaginas: 1,
      multas: [
        {
          numero: null,
          fecha: null,
          descripcion: null,
          monto: '1500.25',
          estado: null
        }
      ]
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/mercurio?pagina=1&itemsPagina=20'
    );
  });

  it('lists intervention orders with independent pagination', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        pagina: 2,
        itemsPagina: 50,
        totalItems: 55,
        totalPaginas: 2,
        ordenes: [
          {
            numero: '2025-99',
            periodo: null,
            motivo: 'Fiscalizacion CM',
            monto: null,
            estado: 'EN_CURSO'
          }
        ]
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(
      source.listInterventionOrders('contributor-1', {
        pagina: 2,
        itemsPagina: 50
      })
    ).resolves.toEqual({
      pagina: 2,
      itemsPagina: 50,
      totalItems: 55,
      totalPaginas: 2,
      ordenes: [
        {
          numero: '2025-99',
          periodo: null,
          motivo: 'Fiscalizacion CM',
          monto: null,
          estado: 'EN_CURSO'
        }
      ]
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/ordenes-intervencion?pagina=2&itemsPagina=50'
    );
  });
});
