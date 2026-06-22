import { unifiedRegisterDetailsFixture } from '../../data/sources/mock/fixtures/unifiedRegisterItems';
import {
  INFORME_CROSS_OPTIONS,
  INFORME_DEFAULT_FORM
} from '../constants/informeGeneration';
import {
  buildInformeContributorData,
  buildInformeGenerationPayload,
  getSelectedInformeCrosses,
  mapContributorCrossesToInformeOptions
} from './buildInformeGenerationPayload';

describe('buildInformeGenerationPayload', () => {
  const item = unifiedRegisterDetailsFixture[0];

  test('maps contributor data from unified register detail and applies temporary defaults', () => {
    const contributorData = buildInformeContributorData(item);

    expect(contributorData).toEqual({
      razonSocial: item.businessName,
      cuit: item.cuit,
      domicilioFiscal: item.fiscalAddress,
      domicilioFiscalElectronico: true,
      emailInformado: 'impuestos@vw-arg.com',
      riesgoFiscal: item.riskLevel,
      actividadesDeclaradas: item.activities.map((activity) => activity.label)
    });
  });

  test('uses temporary fiscal address fallback when contributor has no fiscal address', () => {
    const contributorData = buildInformeContributorData({
      ...item,
      fiscalAddress: '',
      alternateAddress: ''
    });

    expect(contributorData.domicilioFiscal).toBe('calle falsa 123');
  });

  test('normalizes optional fields and includes selected crosses with periodo plus claves', () => {
    const payload = buildInformeGenerationPayload(
      item,
      {
        ...INFORME_DEFAULT_FORM,
        destinatario: '   ',
        datosAccionFiscalizadora: {
          ...INFORME_DEFAULT_FORM.datosAccionFiscalizadora,
          periodo: '01/2025 a 03/2026',
          origenOI: '   ',
          programa: 'CRUCE DE B.I.',
          tipoInstruccion: '',
          impuestoNeto: ' $ 11.768.706 '
        }
      },
      ['cruce_cm']
    );

    expect(payload.destinatario).toBeNull();
    expect(payload.titulo).toBe('INFORME DE INVESTIGACIÓN');
    expect(payload.datosAccionFiscalizadora).toMatchObject({
      periodo: '01/2025 a 03/2026',
      origenOI: null,
      programa: 'CRUCE DE B.I.',
      tipoInstruccion: null,
      impuestoNeto: '$ 11.768.706'
    });
    expect(payload.crucesSeleccionados).toHaveLength(1);
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.claves).toEqual([
      'baseImponibleIngresosBrutos',
      'baseImponibleInformadaPorTerceros',
      'diferenciaBaseImponible'
    ]);
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas).toHaveLength(
      2
    );
    expect(
      payload.crucesSeleccionados[0].columnasSeleccionadas.filas
    ).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ periodo: 'TOTAL' })])
    );
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas[0]).toEqual(
      expect.objectContaining({
        periodo: '2025',
        baseImponibleIngresosBrutos: expect.any(String),
        baseImponibleInformadaPorTerceros: expect.any(String),
        diferenciaBaseImponible: expect.any(String)
      })
    );
  });

  test('excludes total rows from selected crosses used by the preview', () => {
    const selectedCrosses = getSelectedInformeCrosses(['cruce_cm']);

    expect(selectedCrosses).toHaveLength(1);
    expect(selectedCrosses[0].columnasSeleccionadas.filas).toHaveLength(2);
    expect(selectedCrosses[0].columnasSeleccionadas.filas).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ periodo: 'TOTAL' })])
    );
  });

  test('uses the current selected column keys for report payload rows', () => {
    const payload = buildInformeGenerationPayload(
      item,
      INFORME_DEFAULT_FORM,
      ['cruce_cm'],
      [
        {
          ...INFORME_CROSS_OPTIONS[0],
          columnasSeleccionadas: {
            ...INFORME_CROSS_OPTIONS[0].columnasSeleccionadas,
            claves: ['diferenciaBaseImponible']
          }
        }
      ]
    );

    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.claves).toEqual([
      'diferenciaBaseImponible'
    ]);
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas[0]).toEqual({
      periodo: '2025',
      diferenciaBaseImponible: '$ 207.204.355'
    });
  });

  test('maps backend contributor cross columns to report-ready informe options', () => {
    const options = mapContributorCrossesToInformeOptions([
      {
        cross: {
          id: 'backend-cross-id',
          code: 'ControlDesvioBiRegimenCm',
          name: 'Control de desvío de BI — Régimen CM'
        },
        columnsData: {
          code: 'ControlDesvioBiRegimenCm',
          columns: ['anio', 'biEstimada', 'diferenciaBi', 'detalle'],
          rows: [
            {
              anio: 2025,
              biEstimada: 1751937.4278,
              diferenciaBi: 824432.4378,
              detalle: ({
                estado: 'Completo'
              } as unknown as string)
            }
          ]
        }
      }
    ]);

    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({
      id: 'backend-cross-id',
      nombre: 'Control de desvío de BI — Régimen CM'
    });
    expect(options[0].isReportReady).toBeUndefined();
    expect(options[0].columnasSeleccionadas.claves).toEqual([]);
    expect(options[0].previewColumns.map((column) => column.label)).toEqual([
      'AÑO',
      'BI ESTIMADA',
      'DIFERENCIA BI',
      'DETALLE'
    ]);

    const optionsWithSelectedColumns = [
      {
        ...options[0],
        columnasSeleccionadas: {
          ...options[0].columnasSeleccionadas,
          claves: ['biEstimada', 'detalle']
        }
      }
    ];
    const payload = buildInformeGenerationPayload(
      item,
      INFORME_DEFAULT_FORM,
      ['backend-cross-id'],
      optionsWithSelectedColumns
    );

    expect(payload.crucesSeleccionados).toHaveLength(1);
    expect(payload.crucesSeleccionados[0].nombre).toBe(
      'Control de desvío de BI — Régimen CM'
    );
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas).toEqual([
      {
        periodo: '2025',
        biEstimada: 1751937.4278,
        detalle: '{"estado":"Completo"}'
      }
    ]);
  });

  test('keeps backend crosses unavailable when the dynamic detail fails', () => {
    const options = mapContributorCrossesToInformeOptions([
      {
        cross: {
          id: 'unknown-cross-id',
          code: 'ControlCreditos',
          name: 'Control de créditos'
        },
        columnsData: null,
        error: 'No existe resultado disponible para el contribuyente y cruce informados.'
      }
    ]);

    expect(options[0]).toMatchObject({
      id: 'unknown-cross-id',
      nombre: 'Control de créditos',
      isReportReady: false,
      columnasSeleccionadas: {
        claves: [],
        filas: []
      }
    });
  });
});
