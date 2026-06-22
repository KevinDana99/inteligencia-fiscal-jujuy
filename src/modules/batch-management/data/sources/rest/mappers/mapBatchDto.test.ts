import { mapBatchAvailableCrossesResponseDto } from './mapBatchDto';

describe('mapBatchAvailableCrossesResponseDto', () => {
  it('maps backend monthly and annual cross groups', () => {
    const result = mapBatchAvailableCrossesResponseDto({
      crucesMensuales: [
        {
          codigoCruce: 'control-mensual',
          versionCruce: '1.0.0'
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
        periodicity: 'monthly'
      },
      {
        id: 'desvio-bi-convenio-multilateral:1.0.0',
        label: 'Control de desvio de BI - Regimen CM',
        publicCode: 'desvio-bi-convenio-multilateral',
        version: '1.0.0',
        periodicity: 'annual'
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
          periodicidad: 'Mensual'
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
        periodicity: 'monthly'
      },
      {
        id: 'control-anual:1',
        label: 'Control anual',
        publicCode: 'control-anual',
        version: '1',
        periodicity: 'annual'
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
        periodicity: 'annual'
      }
    ]);
  });
});
