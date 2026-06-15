import { unifiedRegisterDetailsFixture } from '../../data/sources/mock/fixtures/unifiedRegisterItems';
import {
  INFORME_CROSS_OPTIONS,
  INFORME_DEFAULT_FORM
} from '../constants/informeGeneration';
import {
  buildInformeContributorData,
  buildInformeGenerationPayload,
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
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas[0]).toEqual(
      expect.objectContaining({
        periodo: '2025',
        baseImponibleIngresosBrutos: expect.any(String),
        baseImponibleInformadaPorTerceros: expect.any(String),
        diferenciaBaseImponible: expect.any(String)
      })
    );
  });

  test('maps backend contributor crosses to report-ready informe options', () => {
    const options = mapContributorCrossesToInformeOptions([
      {
        id: 'backend-cross-id',
        code: 'ControlDesvioBiRegimenCm',
        name: 'Control de desvío de BI — Régimen CM'
      }
    ]);

    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({
      id: 'backend-cross-id',
      nombre: 'Control de desvío de BI — Régimen CM'
    });
    expect(options[0].isReportReady).toBeUndefined();
    expect(options[0].columnasSeleccionadas.claves).toEqual(
      INFORME_CROSS_OPTIONS[0].columnasSeleccionadas.claves
    );

    const payload = buildInformeGenerationPayload(
      item,
      INFORME_DEFAULT_FORM,
      ['backend-cross-id'],
      options
    );

    expect(payload.crucesSeleccionados).toHaveLength(1);
    expect(payload.crucesSeleccionados[0].nombre).toBe(
      'Control de desvío de BI — Régimen CM'
    );
    expect(payload.crucesSeleccionados[0].columnasSeleccionadas.filas).toEqual(
      INFORME_CROSS_OPTIONS[0].columnasSeleccionadas.filas
    );
  });

  test('keeps unknown backend crosses unavailable for informe generation', () => {
    const options = mapContributorCrossesToInformeOptions([
      {
        id: 'unknown-cross-id',
        code: 'ControlCreditos',
        name: 'Control de créditos'
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
