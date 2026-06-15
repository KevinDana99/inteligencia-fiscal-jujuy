import type { IUnifiedRegisterHeaderRecord } from '../models/UnifiedRegister';
import { unifiedRegisterDetailsFixture } from '../sources/mock/fixtures/unifiedRegisterItems';
import { applyUnifiedRegisterHeaderToDetail } from './unifiedRegisterDetail';

describe('applyUnifiedRegisterHeaderToDetail', () => {
  it('formats ISO activity start dates as a readable day/month/year value', () => {
    const item = unifiedRegisterDetailsFixture[0];
    const header: IUnifiedRegisterHeaderRecord = {
      cuit: item.cuit,
      razonSocial: item.businessName,
      activo: true,
      tipoContribuyente: 'Convenio Multilateral',
      cantidadLotes: 3,
      actividadPrimaria: {
        nombre: item.activity,
        numero: '451111'
      },
      actividadSecundaria: null,
      inicioActividad: '2020-01-01T00:00:00+00:00',
      domicilios: {
        fiscal: item.fiscalAddress,
        comercial: item.commercialAddress,
        alternativo: null
      },
      biDeclarada: '$16.879 M',
      impuestosDeclarados: '$253.194 K',
      deuda: '$38.450 K',
      declaracionesJuradas: {
        presentadas: 10,
        noPresentadas: 2
      },
      riesgo: 'A'
    };

    const detail = applyUnifiedRegisterHeaderToDetail(item, header);

    expect(detail.startedAt).toBe('01/01/2020');
  });
});
