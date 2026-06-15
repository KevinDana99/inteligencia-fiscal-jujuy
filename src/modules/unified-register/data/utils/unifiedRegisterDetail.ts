import type {
  IUnifiedRegisterActivityEntry,
  IUnifiedRegisterDetail,
  IUnifiedRegisterHeaderActivity,
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterWidget
} from '../models/UnifiedRegister';

function getNullableText(value: string | null | undefined) {
  return value ?? '';
}

function formatHeaderDate(value: string | null | undefined) {
  const normalizedValue = getNullableText(value).trim();

  if (!normalizedValue) {
    return '';
  }

  const isoDateMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);

  if (!isoDateMatch) {
    return normalizedValue;
  }

  const [, year, month, day] = isoDateMatch;

  return `${day}/${month}/${year}`;
}

function buildActivityEntry(
  activity: IUnifiedRegisterHeaderActivity | null,
  fallback: Partial<IUnifiedRegisterActivityEntry>,
  type: IUnifiedRegisterActivityEntry['type']
): IUnifiedRegisterActivityEntry | null {
  if (!activity?.nombre) {
    return null;
  }

  return {
    id: fallback.id ?? type.toLowerCase(),
    type,
    label: activity.nombre,
    tag: fallback.tag ?? type,
    tagTone: fallback.tagTone ?? (type === 'Primaria' ? 'blue' : 'violet')
  };
}

function applyHeaderWidgetValues(
  widgets: IUnifiedRegisterWidget[],
  header: IUnifiedRegisterHeaderRecord
) {
  return widgets.map((widget) => {
    if (widget.id === 'declared-bi') {
      return { ...widget, value: getNullableText(header.biDeclarada) };
    }

    if (widget.id === 'declared-taxes') {
      return { ...widget, value: getNullableText(header.impuestosDeclarados) };
    }

    if (widget.id === 'debt') {
      return { ...widget, value: getNullableText(header.deuda) };
    }

    if (widget.id === 'returns') {
      return {
        ...widget,
        splitValue: {
          primaryValue: String(header.declaracionesJuradas.presentadas),
          primaryLabel: 'Presentadas',
          secondaryValue: String(header.declaracionesJuradas.noPresentadas),
          secondaryLabel: 'No presentadas'
        }
      };
    }

    return widget;
  });
}

export function applyUnifiedRegisterHeaderToDetail(
  item: IUnifiedRegisterDetail,
  header: IUnifiedRegisterHeaderRecord
): IUnifiedRegisterDetail {
  const activities = [
    buildActivityEntry(header.actividadPrimaria, item.activities[0] ?? {}, 'Primaria'),
    buildActivityEntry(
      header.actividadSecundaria,
      item.activities[1] ?? {},
      'Secundaria'
    )
  ].filter((activity): activity is IUnifiedRegisterActivityEntry => Boolean(activity));

  return {
    ...item,
    cuit: header.cuit,
    businessName: getNullableText(header.razonSocial),
    status: header.activo ? 'Activo' : 'Inactivo',
    regime: header.tipoContribuyente,
    activity: getNullableText(header.actividadPrimaria?.nombre),
    riskLevel: header.riesgo,
    startedAt: formatHeaderDate(header.inicioActividad),
    jurisdiction: '',
    fiscalAddress: getNullableText(header.domicilios.fiscal),
    commercialAddress: getNullableText(header.domicilios.comercial),
    alternateAddress: '',
    controlLotsLabel: `${header.cantidadLotes} lotes`,
    secondaryActivity: getNullableText(header.actividadSecundaria?.nombre),
    widgets: applyHeaderWidgetValues(item.widgets, header),
    activities
  };
}
