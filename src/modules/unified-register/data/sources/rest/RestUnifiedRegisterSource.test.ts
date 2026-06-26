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
        totalCuits: 92,
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
          },
          {
            id: 'fc094ce7-1f6a-1678-eb01-23b95265f492',
            cuit: '33100009116',
            razonSocial: 'Contribuyente DEV 00001',
            actividad: 'DESARROLLO DE SOFTWARE',
            tipoContribuyente: 'LOCAL',
            activo: true,
            riesgo: ''
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
      totalItems: 92,
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
        },
        {
          contribuyenteId: 'fc094ce7-1f6a-1678-eb01-23b95265f492',
          cuit: '33100009116',
          businessName: 'Contribuyente DEV 00001',
          activity: 'DESARROLLO DE SOFTWARE',
          regime: 'Regimen Local',
          status: 'Activo',
          riskLevel: null
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
        jurisdiccion: 'Jujuy (J.910)',
        actividadPrimaria: {
          nombre: 'DESARROLLO DE SOFTWARE',
          numero: '620100'
        },
        actividadSecundaria: null,
        inicioActividad: null,
        domicilios: {
          fiscal: null,
          alternativo: [
            {
              id: 'alternate-address-1',
              nombre: 'Belgrano 890, S.S. de Jujuy'
            }
          ]
        },
        biDeclarada: null,
        impuestosDeclarados: '120.05',
        deuda: null,
        declaracionesJuradas: {
          presentadas: 1,
          noPresentadas: 0
        },
        riesgo: ''
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
      jurisdiccion: 'Jujuy (J.910)',
      jurisdiccionSede: null,
      jurisdiccionesExternas: null,
      actividadPrimaria: {
        nombre: 'DESARROLLO DE SOFTWARE',
        numero: '620100'
      },
      actividadSecundaria: null,
      inicioActividad: null,
      domicilios: {
        fiscal: null,
        alternativo: [
          {
            id: 'alternate-address-1',
            nombre: 'Belgrano 890, S.S. de Jujuy'
          }
        ]
      },
      biDeclarada: null,
      impuestosDeclarados: '120.05',
      deuda: null,
      periodoCalculo: null,
      periodosCalculo: null,
      declaracionesJuradas: {
        presentadas: 1,
        noPresentadas: 0
      },
      riesgo: null
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/encabezado'
    );
  });

  it('lists contributor crosses through the contributor endpoint', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        cruces: [
          {
            id: '7d2e8d59-7d08-4a9f-a12d-449120fb7c9c',
            nombre: 'ControlDesvioBiRegimenCm'
          },
          {
            id: '7a86dc42-9464-46ad-9331-957221581bdf',
            nombre: 'ControlCreditos'
          }
        ]
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(
      source.listContributorCrosses('contributor-1')
    ).resolves.toEqual({
      crosses: [
        {
          id: '7d2e8d59-7d08-4a9f-a12d-449120fb7c9c',
          code: 'ControlDesvioBiRegimenCm',
          name: 'Control de desvío de BI — Régimen CM'
        },
        {
          id: '7a86dc42-9464-46ad-9331-957221581bdf',
          code: 'ControlCreditos',
          name: 'Control de créditos'
        }
      ]
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/contribuyentes/contributor-1/cruces'
    );
  });

  it('gets contributor cross columns through the dynamic columns endpoint', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        nombreCruce: 'ControlDesvioBiRegimenCm',
        datos: {
          columnas: ['anio', 'biEstimada', 'diferenciaBi', 'detalle'],
          filas: [
            {
              anio: 2025,
              biEstimada: 1751937.4278,
              diferenciaBi: 824432.4378,
              detalle: {
                estado: 'Completo'
              }
            }
          ]
        }
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(
      source.getContributorCrossColumns('contributor-1', 'cross-1')
    ).resolves.toEqual({
      code: 'ControlDesvioBiRegimenCm',
      columns: ['anio', 'biEstimada', 'diferenciaBi', 'detalle'],
      rows: [
        {
          anio: 2025,
          biEstimada: 1751937.4278,
          diferenciaBi: 824432.4378,
          detalle: '{"estado":"Completo"}'
        }
      ]
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/contribuyentes/cruces/columnas?contribuyenteId=contributor-1&cruceId=cross-1'
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
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/mercurio?Pagina=1&ItemsPagina=20'
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
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/ordenes-intervencion?Pagina=2&ItemsPagina=50'
    );
  });

  it('lists empty intervention orders with default Swagger pagination params', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        pagina: 1,
        itemsPagina: 20,
        totalItems: 0,
        totalPaginas: 0,
        ordenes: []
      })
    );

    const source = new RestUnifiedRegisterSource({
      baseUrl: 'http://api.test',
      token: 'access-token'
    });

    await expect(source.listInterventionOrders('contributor-1')).resolves.toEqual({
      pagina: 1,
      itemsPagina: 20,
      totalItems: 0,
      totalPaginas: 0,
      ordenes: []
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://api.test/api/procesos-informacion/padron/unificado/contributor-1/ordenes-intervencion?Pagina=1&ItemsPagina=20'
    );
  });
});
