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

function parseHeaderCurrencyAmount(value: string | null | undefined) {
  const rawValue = getNullableText(value).trim();

  if (!rawValue || /[a-z]/i.test(rawValue.replace(/\bARS\b/gi, ''))) {
    return null;
  }

  const sanitizedValue = rawValue.replace(/\bARS\b/gi, '').replace(/[^\d,.-]/g, '');

  if (!/\d/.test(sanitizedValue)) {
    return null;
  }

  const lastCommaIndex = sanitizedValue.lastIndexOf(',');
  const lastDotIndex = sanitizedValue.lastIndexOf('.');
  const hasComma = lastCommaIndex !== -1;
  const hasDot = lastDotIndex !== -1;
  let normalizedValue = sanitizedValue;

  if (hasComma && hasDot) {
    normalizedValue =
      lastCommaIndex > lastDotIndex
        ? sanitizedValue.replace(/\./g, '').replace(',', '.')
        : sanitizedValue.replace(/,/g, '');
  } else if (hasComma) {
    normalizedValue = sanitizedValue.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d{1,3}(?:\.\d{3})+$/.test(sanitizedValue)) {
    normalizedValue = sanitizedValue.replace(/\./g, '');
  }

  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatHeaderCurrency(value: string | null | undefined) {
  const numericValue = parseHeaderCurrencyAmount(value);

  if (numericValue === null) {
    return getNullableText(value);
  }

  const hasDecimals = !Number.isInteger(numericValue);

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  })
    .format(numericValue)
    .replace(/\u00a0/g, ' ');
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

function getHeaderAlternateAddress(
  alternativo: IUnifiedRegisterHeaderRecord['domicilios']['alternativo']
) {
  return alternativo?.find((address) => address.nombre.trim())?.nombre ?? '';
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
      return { ...widget, value: formatHeaderCurrency(header.biDeclarada) };
    }

    if (widget.id === 'declared-taxes') {
      return { ...widget, value: formatHeaderCurrency(header.impuestosDeclarados) };
    }

    if (widget.id === 'debt') {
      return { ...widget, value: formatHeaderCurrency(header.deuda) };
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
    jurisdiction: getNullableText(header.jurisdiccion),
    fiscalAddress: getNullableText(header.domicilios.fiscal),
    commercialAddress: getNullableText(header.domicilios.comercial),
    alternateAddress: getHeaderAlternateAddress(header.domicilios.alternativo),
    controlLotsLabel: `${header.cantidadLotes} lotes`,
    secondaryActivity: getNullableText(header.actividadSecundaria?.nombre),
    widgets: applyHeaderWidgetValues(item.widgets, header),
    activities
  };
}
