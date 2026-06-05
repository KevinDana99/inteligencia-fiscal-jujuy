import type {
  ICrossManagementItem,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewIndicator,
  ICrossPreviewPlanRow,
  ICrossPreviewSummaryRow,
  ICrossResultItem,
  ICrossResultsListData
} from '../models/CrossManagement'

const PLAN_COLUMNS = [
  'ID Período',
  'ID Sig.',
  'CUIT',
  'Razón Social',
  'Fact. ARCA (año)',
  'Fact. ARCA (fecha)',
  'Ag. Percepción',
  'Ag. Retención',
  'Pago a Cta.',
  'Retenciones',
  'MAYOR',
  'CM05 Jujuy',
  'Dif. Base',
  'Mes',
  'Año',
  'Cierre Ej.',
  'Tot. Ing. País',
  'CI Decl.',
  'Tot. Egr.',
  'Coef. Egr.',
  'Nuevo CI',
  'CU Decl.',
  'NCU',
  'BI Total País',
  'BI Estimada',
  'BI Decl. CM03',
  'Alícuota',
  'Imp. Presuntivo',
  'Dif. Créditos',
  'SAF',
  'EST. FINAL'
]

const PREVIEW_INDICATORS: ICrossPreviewIndicator[] = [
  { id: 'fuentes-bi', label: 'Fuentes BI', tone: 'blue' },
  { id: 'cm05', label: 'CM05', tone: 'violet' },
  { id: 'coeficientes', label: 'Coeficientes', tone: 'green' },
  { id: 'bi-estimada', label: 'BI Estimada', tone: 'orange' },
  { id: 'impuesto', label: 'Impuesto', tone: 'red' },
  { id: 'final', label: 'Final', tone: 'darkBlue' }
]

const METRIC_KEYS = {
  businessName: [
    'razonSocial',
    'razon_social',
    'razón social',
    'nombreContribuyente',
    'denominacion',
    'denominación',
    'contribuyente'
  ],
  arcaYear: [
    'facturacionArcaAnual',
    'facturacionArcaAnio',
    'facturacion_arca_anio',
    'factArcaAnio',
    'factArcaAnual'
  ],
  arcaDate: [
    'facturacionArcaFecha',
    'facturacion_arca_fecha',
    'factArcaFecha'
  ],
  perceptionAgent: ['agentePercepcion', 'agPercepcion', 'percepciones'],
  retentionAgent: ['agenteRetencion', 'agRetencion', 'retencionesAgente'],
  paymentOnAccount: ['pagoACuenta', 'pago_a_cuenta', 'pagosACuenta'],
  retentions: ['retenciones'],
  greaterBase: ['mayor', 'mayorBase', 'mayor_base'],
  cm05Jujuy: ['cm05Jujuy', 'cm05_jujuy', 'baseCm05Jujuy'],
  declaredBase: [
    'baseImponibleDeclarada',
    'biDeclarada',
    'baseDeclarada',
    'declaredBase',
    'bi910',
    'biDeclCm03'
  ],
  pretendedBase: [
    'baseImponiblePretendida',
    'biPretendida',
    'basePretendida',
    'pretendedBase',
    'biEstimada'
  ],
  difference: ['diferencia', 'diferenciaBase', 'difBase', 'difference'],
  totalCountryIncome: [
    'totalIngresosPais',
    'totIngPais',
    'total_ingresos_pais'
  ],
  declaredCi: ['ciDeclarado', 'ciDecl', 'coeficienteIngresosDeclarado'],
  totalExpenses: ['totalEgresos', 'totEgr', 'total_egresos'],
  expenseCoefficient: ['coeficienteEgresos', 'coefEgr', 'coef_egresos'],
  newCi: ['nuevoCi', 'nuevo_ci', 'nuevoCoeficienteIngresos'],
  declaredCu: ['cuDeclarado', 'cuDecl', 'coeficienteUnificadoDeclarado'],
  newCu: ['ncu', 'nuevoCu', 'nuevo_coeficiente_unificado'],
  totalCountryBase: ['biTotalPais', 'baseTotalPais', 'bi_total_pais'],
  aliquot: ['alicuota', 'alícuota', 'aliquot'],
  tax: ['impuestoEstimado', 'impuestoPresuntivo', 'impuesto', 'tax'],
  creditDifference: ['diferenciaCreditos', 'difCreditos', 'dif_creditos'],
  saf: ['saf', 'saldoAFavor', 'saldo_a_favor'],
  netDebt: ['deudaNeta', 'netDebt', 'netoAPagar', 'neto_a_pagar']
} as const

function normalizeLookupKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

function readRecordValue(
  source: Record<string, unknown>,
  keys: readonly string[]
) {
  const normalizedKeys = new Set(keys.map(normalizeLookupKey))

  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.has(normalizeLookupKey(key))) {
      return value
    }
  }

  return undefined
}

function readResultValue(result: ICrossResultItem, keys: readonly string[]) {
  return (
    readRecordValue(result.dynamicDetail, keys) ??
    readRecordValue(result.metrics, keys)
  )
}

function parseNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const sanitized = value.trim().replace(/[^\d,.-]/g, '')

  if (!sanitized) {
    return null
  }

  const normalized = sanitized.includes(',')
    ? sanitized.replace(/\./g, '').replace(',', '.')
    : sanitized.replace(/\.(?=\d{3}(\D|$))/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  })
    .format(value)
    .replace(/\u00a0/g, ' ')
}

function formatTextValue(value: unknown, fallback = '-') {
  if (typeof value === 'string') {
    return value.trim() || fallback
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }

  return fallback
}

function formatCurrencyValue(value: unknown, fallback = '-') {
  const numericValue = parseNumber(value)

  if (numericValue !== null) {
    return formatCurrency(numericValue)
  }

  return formatTextValue(value, fallback)
}

function formatPercentValue(value: unknown, fallback = '-') {
  const numericValue = parseNumber(value)

  if (numericValue !== null) {
    return `${numericValue.toLocaleString('es-AR', {
      maximumFractionDigits: 4
    })}%`
  }

  return formatTextValue(value, fallback)
}

function readTextMetric(
  result: ICrossResultItem,
  keys: readonly string[],
  fallback = '-'
) {
  return formatTextValue(readResultValue(result, keys), fallback)
}

function readCurrencyMetric(
  result: ICrossResultItem,
  keys: readonly string[],
  fallback = '-'
) {
  return formatCurrencyValue(readResultValue(result, keys), fallback)
}

function readPercentMetric(
  result: ICrossResultItem,
  keys: readonly string[],
  fallback = '-'
) {
  return formatPercentValue(readResultValue(result, keys), fallback)
}

function sumCurrencyMetric(
  results: ICrossResultItem[],
  keys: readonly string[]
) {
  let total = 0
  let hasValue = false

  for (const result of results) {
    const value = parseNumber(readResultValue(result, keys))

    if (value !== null) {
      total += value
      hasValue = true
    }
  }

  return hasValue ? formatCurrency(total) : '-'
}

function formatDateLabel(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value || '-'
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = String(parsedDate.getFullYear())

  return `${day}/${month}/${year}`
}

function formatPeriodDate(value: string) {
  if (!value) {
    return '-'
  }

  return formatDateLabel(`${value}T00:00:00`)
}

function formatCuit(value: string) {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
  }

  return value || '-'
}

function compactCuit(value: string) {
  return value.replace(/\D/g, '') || value
}

function formatCrossName(code: string | undefined) {
  if (!code) {
    return null
  }

  const normalized = code.replace(/[-_]+/g, ' ').trim()

  return normalized ? normalized : code
}

function formatPeriod(result: ICrossResultItem | undefined) {
  if (!result) {
    return '-'
  }

  if (result.period) {
    return result.period
  }

  if (result.periodFrom && result.periodTo) {
    return result.periodFrom === result.periodTo
      ? result.periodFrom
      : `${result.periodFrom}-${result.periodTo}`
  }

  return result.periodFrom || result.periodTo || '-'
}

function getPeriodMonth(result: ICrossResultItem) {
  const dateValue = result.periodTo || result.periodFrom
  const [, month] = dateValue.split('-')

  return month ? String(Number(month)) : '-'
}

function getPeriodYear(result: ICrossResultItem) {
  const dateValue = result.periodTo || result.periodFrom
  const [year] = dateValue.split('-')

  return year || result.period || '-'
}

function getBusinessName(result: ICrossResultItem) {
  const name = readTextMetric(result, METRIC_KEYS.businessName, '')

  return name || `Contribuyente ${formatCuit(result.cuit)}`
}

function inferAnalysisStatus(result: ICrossResultItem): ICrossPreviewAnalysisRow['status'] {
  const normalizedStatus = normalizeLookupKey(result.calculationStatus)

  if (normalizedStatus.includes('repro')) {
    return 'reproceso'
  }

  if (normalizedStatus.includes('relev')) {
    return 'relevante'
  }

  const significantValues = [
    readResultValue(result, METRIC_KEYS.netDebt),
    readResultValue(result, METRIC_KEYS.tax),
    readResultValue(result, METRIC_KEYS.difference)
  ].map(parseNumber)

  return significantValues.some((value) => value !== null && value > 0)
    ? 'relevante'
    : 'estado'
}

function mapPlanRow(result: ICrossResultItem): ICrossPreviewPlanRow {
  const cuit = formatCuit(result.cuit)
  const businessName = getBusinessName(result)
  const periodYear = getPeriodYear(result)
  const periodMonth = getPeriodMonth(result)

  return {
    id: result.id,
    cuit,
    businessName,
    cells: [
      `${compactCuit(cuit)}${result.period || periodYear}`,
      `${compactCuit(cuit)}${periodYear}`,
      cuit,
      businessName,
      readCurrencyMetric(result, METRIC_KEYS.arcaYear),
      readCurrencyMetric(result, METRIC_KEYS.arcaDate),
      readCurrencyMetric(result, METRIC_KEYS.perceptionAgent),
      readCurrencyMetric(result, METRIC_KEYS.retentionAgent),
      readCurrencyMetric(result, METRIC_KEYS.paymentOnAccount),
      readCurrencyMetric(result, METRIC_KEYS.retentions),
      readCurrencyMetric(result, METRIC_KEYS.greaterBase),
      readCurrencyMetric(result, METRIC_KEYS.cm05Jujuy),
      readCurrencyMetric(result, METRIC_KEYS.difference),
      periodMonth,
      periodYear,
      formatPeriodDate(result.periodTo),
      readCurrencyMetric(result, METRIC_KEYS.totalCountryIncome),
      readPercentMetric(result, METRIC_KEYS.declaredCi),
      readCurrencyMetric(result, METRIC_KEYS.totalExpenses),
      readPercentMetric(result, METRIC_KEYS.expenseCoefficient),
      readPercentMetric(result, METRIC_KEYS.newCi),
      readPercentMetric(result, METRIC_KEYS.declaredCu),
      readPercentMetric(result, METRIC_KEYS.newCu),
      readCurrencyMetric(result, METRIC_KEYS.totalCountryBase),
      readCurrencyMetric(result, METRIC_KEYS.pretendedBase),
      readCurrencyMetric(result, METRIC_KEYS.declaredBase),
      readPercentMetric(result, METRIC_KEYS.aliquot),
      readCurrencyMetric(result, METRIC_KEYS.tax),
      readCurrencyMetric(result, METRIC_KEYS.creditDifference),
      readCurrencyMetric(result, METRIC_KEYS.saf),
      readCurrencyMetric(result, METRIC_KEYS.netDebt)
    ]
  }
}

function mapAnalysisRow(result: ICrossResultItem): ICrossPreviewAnalysisRow {
  return {
    cuit: formatCuit(result.cuit),
    businessName: getBusinessName(result),
    declaredBase: readCurrencyMetric(result, METRIC_KEYS.declaredBase),
    pretendedBase: readCurrencyMetric(result, METRIC_KEYS.pretendedBase),
    difference: readCurrencyMetric(result, METRIC_KEYS.difference),
    tax: readCurrencyMetric(result, METRIC_KEYS.tax),
    netDebt: readCurrencyMetric(result, METRIC_KEYS.netDebt),
    status: inferAnalysisStatus(result)
  }
}

function mapSummaryRows(results: ICrossResultItem[]): ICrossPreviewSummaryRow[] {
  const groupedResults = new Map<string, ICrossResultItem[]>()

  for (const result of results) {
    const regime = result.granularity?.trim().toUpperCase() || 'CRUCE'
    groupedResults.set(regime, [...(groupedResults.get(regime) ?? []), result])
  }

  return Array.from(groupedResults, ([regime, group]) => ({
    regime,
    declaredBase: sumCurrencyMetric(group, METRIC_KEYS.declaredBase),
    pretendedBase: sumCurrencyMetric(group, METRIC_KEYS.pretendedBase),
    difference: sumCurrencyMetric(group, METRIC_KEYS.difference),
    tax: sumCurrencyMetric(group, METRIC_KEYS.tax),
    netDebt: sumCurrencyMetric(group, METRIC_KEYS.netDebt)
  }))
}

export function mapCrossResultsToPreview(
  executionId: number,
  data: ICrossResultsListData,
  execution?: ICrossManagementItem | null
): ICrossPreviewData | null {
  const [firstResult] = data.results

  if (!firstResult) {
    return null
  }

  const analysisRows = data.results.map(mapAnalysisRow)
  const relevantCount = analysisRows.filter(
    (row) => row.status === 'relevante'
  ).length

  return {
    id: String(executionId),
    name:
      execution?.name ??
      formatCrossName(firstResult.crossCode) ??
      `Cruce ${executionId}`,
    source: execution?.source ?? (data.totalItems > 1 ? 'Lote' : 'Padrón'),
    sourceRef:
      execution?.sourceRef ??
      (data.totalItems > 1
        ? `Ejecución ${executionId}`
        : formatCuit(firstResult.cuit)),
    period: execution?.period ?? formatPeriod(firstResult),
    cuitCount: data.totalItems || data.results.length,
    date: execution?.date ?? formatDateLabel(firstResult.createdAt),
    relevantCountLabel:
      relevantCount === 1 ? '1 relevante' : `${relevantCount} relevantes`,
    indicators: PREVIEW_INDICATORS,
    planColumns: PLAN_COLUMNS,
    planRows: data.results.map(mapPlanRow),
    summaryRows: mapSummaryRows(data.results),
    analysisRows
  }
}
