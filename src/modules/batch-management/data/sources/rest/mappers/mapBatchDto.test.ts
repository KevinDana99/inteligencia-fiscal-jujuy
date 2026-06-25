import {
  mapBatchAvailableCrossesResponseDto,
  mapBatchDetailResponseDto,
  mapBatchListItemDto
} from './mapBatchDto';

describe('mapBatchDetailResponseDto', () => {
  it('maps backend CUIT pagination metadata separately from visible CUITs', () => {
    const result = mapBatchDetailResponseDto({
      id: 'batch-1',
      numeroLote: '000001',
      nombre: 'Lote grande',
      descripcion: null,
      regimen: 'Convenio Multilateral',
      pagina: 1,
      itemsPagina: 20,
      totalItems: 10000,
      totalPaginas: 500,
      cantidadCuits: 10000,
      fechaGeneracion: '2026-06-15T00:00:00.000Z',
      creadoPor: {
        id: 'user-1',
        nombre: 'Ada Lovelace'
      },
      cuits: Array.from({ length: 20 }, (_, index) => ({
        cuit: `2030405${String(index + 1).padStart(4, '0')}`,
        razonSocial: `Contribuyente ${index + 1}`,
        regimen: 'Convenio Multilateral' as const,
        orden: index + 1
      }))
    });

    expect(result.cuits).toHaveLength(20);
    expect(result.cuitPage).toBe(1);
    expect(result.cuitItemsPerPage).toBe(20);
    expect(result.cuitTotalItems).toBe(10000);
    expect(result.cuitTotalPages).toBe(500);
    expect(result.cuitCount).toBe(10000);
  });
});

describe('mapBatchListItemDto', () => {
  it('keeps cantidadCuits as the main table total', () => {
    const result = mapBatchListItemDto({
      id: 'batch-1',
      numeroLote: '000001',
      nombre: 'Lote grande',
      descripcion: null,
      regimen: 'Convenio Multilateral',
      cantidadCuits: 10000,
      fechaGeneracion: '2026-06-15T00:00:00.000Z',
      creadoPor: {
        id: 'user-1',
        nombre: 'Ada Lovelace'
      }
    });

    expect(result.cuitCount).toBe(10000);
    expect(result.cuits).toHaveLength(0);
  });
});

describe('mapBatchAvailableCrossesResponseDto', () => {
  it('maps backend monthly and annual cross groups', () => {
    const result = mapBatchAvailableCrossesResponseDto({
      crucesMensuales: [
        {
          codigoCruce: 'control-mensual',
          versionCruce: '1.0.0',
          vistasDisponibles: ['resumen']
        }
      ],
      crucesAnuales: [
        {
          codigoCruce: 'desvio-bi-convenio-multilateral',
          versionCruce: '1.0.0'
        }
      ]
    });

    expect(result).toEqual([
      {
        id: 'control-mensual:1.0.0',
        label: 'control-mensual',
        publicCode: 'control-mensual',
        version: '1.0.0',
        periodicity: 'monthly',
        viewsAvailable: ['resumen']
      },
      {
        id: 'desvio-bi-convenio-multilateral:1.0.0',
        label: 'Control de desvio de BI - Regimen CM',
        publicCode: 'desvio-bi-convenio-multilateral',
        version: '1.0.0',
        periodicity: 'annual',
        viewsAvailable: ['resumen', 'planilla']
      }
    ]);
  });

  it('maps wrapped available crosses using backend field aliases', () => {
    const result = mapBatchAvailableCrossesResponseDto({
      cruces: [
        {
          codigoCruce: 'desvio-bi-convenio-multilateral',
          nombreCruce: 'Desvio de base imponible - Convenio Multilateral',
          versionCruce: '2.0.0',
          periodicidad: 'Mensual',
          vistasDisponibles: ['resumen', 'planilla']
        },
        {
          codigo: 'control-anual',
          nombre: 'Control anual',
          version: 1,
          frecuencia: 'Anual'
        }
      ]
    });

    expect(result).toEqual([
      {
        id: 'desvio-bi-convenio-multilateral:2.0.0',
        label: 'Desvio de base imponible - Convenio Multilateral',
        publicCode: 'desvio-bi-convenio-multilateral',
        version: '2.0.0',
        periodicity: 'monthly',
        viewsAvailable: ['resumen', 'planilla']
      },
      {
        id: 'control-anual:1',
        label: 'Control anual',
        publicCode: 'control-anual',
        version: '1',
        periodicity: 'annual',
        viewsAvailable: ['resumen', 'planilla']
      }
    ]);
  });

  it('supports nested data wrappers and removes duplicated crosses', () => {
    const result = mapBatchAvailableCrossesResponseDto({
      data: {
        cruces: [
          {
            code: 'control-duplicado',
            name: 'Control duplicado',
            versionActual: '1.0.0'
          },
          {
            code: 'control-duplicado',
            name: 'Control duplicado',
            versionActual: '1.0.0'
          }
        ]
      }
    });

    expect(result).toEqual([
      {
        id: 'control-duplicado:1.0.0',
        label: 'Control duplicado',
        publicCode: 'control-duplicado',
        version: '1.0.0',
        periodicity: 'annual',
        viewsAvailable: ['resumen', 'planilla']
      }
    ]);
  });
});
