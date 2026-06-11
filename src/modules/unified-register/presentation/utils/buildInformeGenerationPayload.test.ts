import { unifiedRegisterDetailsFixture } from '../../data/sources/mock/fixtures/unifiedRegisterItems';
import { INFORME_DEFAULT_FORM } from '../constants/informeGeneration';
import {
  buildInformeContributorData,
  buildInformeGenerationPayload
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
});
