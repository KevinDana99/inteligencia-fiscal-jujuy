import type { IUnifiedRegisterHeaderRecord } from '../models/UnifiedRegister';
import { unifiedRegisterDetailsFixture } from '../sources/mock/fixtures/unifiedRegisterItems';
import { applyUnifiedRegisterHeaderToDetail } from './unifiedRegisterDetail';

function createHeader(
  overrides: Partial<IUnifiedRegisterHeaderRecord> = {}
): IUnifiedRegisterHeaderRecord {
  const item = unifiedRegisterDetailsFixture[0];

  return {
    cuit: item.cuit,
    razonSocial: item.businessName,
    activo: true,
    tipoContribuyente: 'Convenio Multilateral',
    cantidadLotes: 3,
    jurisdiccion: item.jurisdiction,
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
    riesgo: 'A',
    ...overrides
  };
}

function getWidgetValue(widgetId: string, header: IUnifiedRegisterHeaderRecord) {
  const detail = applyUnifiedRegisterHeaderToDetail(
    unifiedRegisterDetailsFixture[0],
    header
  );

  return detail.widgets.find((widget) => widget.id === widgetId)?.value;
}

describe('applyUnifiedRegisterHeaderToDetail', () => {
  it('formats ISO activity start dates as a readable day/month/year value', () => {
    const item = unifiedRegisterDetailsFixture[0];
    const header = createHeader();

    const detail = applyUnifiedRegisterHeaderToDetail(item, header);

    expect(detail.startedAt).toBe('01/01/2020');
  });

  it('uses jurisdiction and alternate address values from the header response', () => {
    const item = unifiedRegisterDetailsFixture[0];
    const header = createHeader({
      jurisdiccion: 'Salta (J.917)',
      domicilios: {
        fiscal: item.fiscalAddress,
        comercial: item.commercialAddress,
        alternativo: [
          {
            id: 'alternate-address-1',
            nombre: 'España 456, San Salvador de Jujuy'
          },
          {
            id: 'alternate-address-2',
            nombre: 'Belgrano 890, San Salvador de Jujuy'
          }
        ]
      }
    });

    const detail = applyUnifiedRegisterHeaderToDetail(item, header);

    expect(detail.jurisdiction).toBe('Salta (J.917)');
    expect(detail.alternateAddress).toBe('España 456, San Salvador de Jujuy');
  });

  it('formats numeric header amount values as ARS currency', () => {
    const header = createHeader({
      biDeclarada: '16879000',
      impuestosDeclarados: '120.05',
      deuda: '38450000'
    });

    expect(getWidgetValue('declared-bi', header)).toBe('$ 16.879.000');
    expect(getWidgetValue('declared-taxes', header)).toBe('$ 120,05');
    expect(getWidgetValue('debt', header)).toBe('$ 38.450.000');
  });

  it('keeps compact mocked metric labels when the backend value is not numeric-only', () => {
    const header = createHeader();

    expect(getWidgetValue('declared-bi', header)).toBe('$16.879 M');
    expect(getWidgetValue('declared-taxes', header)).toBe('$253.194 K');
    expect(getWidgetValue('debt', header)).toBe('$38.450 K');
  });
});
