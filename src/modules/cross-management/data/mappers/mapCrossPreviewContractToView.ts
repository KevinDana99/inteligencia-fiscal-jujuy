import { CROSS_PREVIEW_INDICATORS } from '../../constants/crossPreviewIndicators'
import type {
  ICrossAnalysisRow,
  ICrossDynamicColumn,
  ICrossManagementItem,
  ICrossPaginationData,
  ICrossPlanillaData,
  ICrossPlanillaRow,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewPlanRow,
  ICrossPreviewSummaryBlock,
  ICrossResultItem,
  ICrossResultsListData,
  ICrossResumenBlock,
  ICrossResumenData
} from '../models/CrossManagement'
import {
  mapDynamicRowValue,
  mapDynamicRowValues
} from '../utils/crossPreviewDynamicValues'

function formatCuit(value: string) {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
  }

  return value || '-'
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || '-'
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

function normalizeLookup(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const RESULT_PLAN_VALUE_KEYS = {
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

type ResultPlanColumnDefinition = ICrossDynamicColumn & {
  resolve: (result: ICrossResultItem) => string
}

function normalizeResultLookupKey(value: string) {
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
  const normalizedKeys = new Set(keys.map(normalizeResultLookupKey))

  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.has(normalizeResultLookupKey(key))) {
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

function parseResultNumber(value: unknown) {
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

function formatCurrencyValue(value: unknown, fallback = '-') {
  const numericValue = parseResultNumber(value)

  if (numericValue !== null) {
    return new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: 2
    }).format(numericValue)
  }

  return formatTextValue(value, fallback)
}

function formatPercentValue(value: unknown, fallback = '-') {
  const numericValue = parseResultNumber(value)

  if (numericValue !== null) {
    return `${numericValue.toLocaleString('es-AR', {
      maximumFractionDigits: 4
    })}%`
  }

  return formatTextValue(value, fallback)
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

function compactCuit(value: string) {
  return value.replace(/\D/g, '') || value
}

function formatPeriodDate(value: string) {
  if (!value) {
    return '-'
  }

  return formatDateLabel(`${value}T00:00:00`)
}

function getPeriodYear(result: ICrossResultItem) {
  const dateValue = result.periodTo || result.periodFrom
  const [year] = dateValue.split('-')

  return year || result.period || '-'
}

function getPeriodMonth(result: ICrossResultItem) {
  const dateValue = result.periodTo || result.periodFrom
  const [, month] = dateValue.split('-')

  return month ? String(Number(month)) : '-'
}

function getBusinessName(result: ICrossResultItem) {
  const name = readTextMetric(result, RESULT_PLAN_VALUE_KEYS.businessName, '')

  return name || `Contribuyente ${formatCuit(result.cuit)}`
}

const RESULT_PLAN_COLUMNS: ResultPlanColumnDefinition[] = [
  {
    key: 'idPeriodo',
    label: 'ID Período',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      `${compactCuit(result.cuit)}${result.period || getPeriodYear(result)}`
  },
  {
    key: 'idSig',
    label: 'ID Sig.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => `${compactCuit(result.cuit)}${getPeriodYear(result)}`
  },
  {
    key: 'cuit',
    label: 'CUIT',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => formatCuit(result.cuit)
  },
  {
    key: 'razonSocial',
    label: 'Razón Social',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: getBusinessName
  },
  {
    key: 'facturacionArcaAnual',
    label: 'Fact. ARCA (año)',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.arcaYear)
  },
  {
    key: 'facturacionArcaFecha',
    label: 'Fact. ARCA (fecha)',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.arcaDate)
  },
  {
    key: 'agentePercepcion',
    label: 'Ag. Percepción',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.perceptionAgent)
  },
  {
    key: 'agenteRetencion',
    label: 'Ag. Retención',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.retentionAgent)
  },
  {
    key: 'pagoACuenta',
    label: 'Pago a Cta.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.paymentOnAccount)
  },
  {
    key: 'retenciones',
    label: 'Retenciones',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.retentions)
  },
  {
    key: 'mayor',
    label: 'MAYOR',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.greaterBase)
  },
  {
    key: 'cm05Jujuy',
    label: 'CM05 Jujuy',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.cm05Jujuy)
  },
  {
    key: 'difAFavorDpr',
    label: 'Dif. Base',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.difference)
  },
  {
    key: 'mes',
    label: 'Mes',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: getPeriodMonth
  },
  {
    key: 'ano',
    label: 'Año',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: getPeriodYear
  },
  {
    key: 'cierreEj',
    label: 'Cierre Ej.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => formatPeriodDate(result.periodTo)
  },
  {
    key: 'totalIngresosPais',
    label: 'Tot. Ing. País',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.totalCountryIncome)
  },
  {
    key: 'ciDeclarado',
    label: 'CI Decl.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.declaredCi)
  },
  {
    key: 'totalEgresos',
    label: 'Tot. Egr.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.totalExpenses)
  },
  {
    key: 'coeficienteEgresos',
    label: 'Coef. Egr.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.expenseCoefficient)
  },
  {
    key: 'nuevoCi',
    label: 'Nuevo CI',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.newCi)
  },
  {
    key: 'cuDeclarado',
    label: 'CU Decl.',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.declaredCu)
  },
  {
    key: 'ncu',
    label: 'NCU',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.newCu)
  },
  {
    key: 'biTotalPais',
    label: 'BI Total País',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.totalCountryBase)
  },
  {
    key: 'biEstimada',
    label: 'BI Estimada',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.pretendedBase)
  },
  {
    key: 'biDeclCm03',
    label: 'BI Decl. CM03',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.declaredBase)
  },
  {
    key: 'alicuota',
    label: 'Alícuota',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readPercentMetric(result, RESULT_PLAN_VALUE_KEYS.aliquot)
  },
  {
    key: 'impuestoPresuntivo',
    label: 'Imp. Presuntivo',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.tax)
  },
  {
    key: 'diferenciaCreditos',
    label: 'Dif. Créditos',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) =>
      readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.creditDifference)
  },
  {
    key: 'saf',
    label: 'SAF',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.saf)
  },
  {
    key: 'estadoFinal',
    label: 'EST. FINAL',
    type: 'string',
    isFilterable: false,
    allowedOperators: [],
    resolve: (result) => readCurrencyMetric(result, RESULT_PLAN_VALUE_KEYS.netDebt)
  }
]

function mapCrossResultToPlanillaRow(result: ICrossResultItem): ICrossPlanillaRow {
  return {
    cuit: result.cuit,
    businessName: getBusinessName(result),
    taxpayerId: result.taxpayerId || null,
    texts: Object.fromEntries(
      RESULT_PLAN_COLUMNS.map((column) => [column.key, column.resolve(result)])
    ),
    dates: {},
    metrics: {}
  }
}

export function mapCrossResultsToPlanillaData(
  data: ICrossResultsListData
): ICrossPlanillaData {
  const columns = RESULT_PLAN_COLUMNS.map((column) => ({
    allowedOperators: column.allowedOperators,
    isFilterable: column.isFilterable,
    key: column.key,
    label: column.label,
    type: column.type
  }))

  return {
    schema: { columns },
    page: data.page,
    itemsPerPage: data.itemsPerPage,
    totalItems: data.totalItems,
    totalPages: data.totalPages,
    rows: data.results.map(mapCrossResultToPlanillaRow)
  }
}

function mapRelevanceStatus(value: string | null): ICrossPreviewAnalysisRow['status'] {
  const normalized = normalizeLookup(value)

  if (normalized.includes('repro')) {
    return 'reproceso'
  }

  if (normalized.includes('relev')) {
    return 'relevante'
  }

  return 'estado'
}

function resolvePlanillaCellValue(
  row: ICrossPlanillaRow,
  column: ICrossDynamicColumn
) {
  if (column.key === 'cuit') {
    return formatCuit(row.cuit)
  }

  if (column.key === 'razonSocial') {
    return normalizeText(row.businessName)
  }

  return mapDynamicRowValue(row, column)
}

function resolveAnalysisCellValue(
  row: ICrossAnalysisRow,
  column: ICrossDynamicColumn
) {
  if (column.key === 'cuit') {
    return formatCuit(row.cuit)
  }

  if (column.key === 'razonSocial') {
    return normalizeText(row.businessName)
  }

  if (column.key === 'estadoRelevancia') {
    return normalizeText(row.relevanceStatus)
  }

  return mapDynamicRowValue(row, column)
}

export function mapPlanillaRowsToPreview(
  rows: ICrossPlanillaRow[],
  columns: ICrossDynamicColumn[]
): ICrossPreviewPlanRow[] {
  return rows.map((row, rowIndex) => {
    const values = Object.fromEntries(
      columns.map((column) => [column.key, resolvePlanillaCellValue(row, column)])
    )

    return {
      id: row.taxpayerId ?? `${row.cuit}-${rowIndex}`,
      taxpayerId: row.taxpayerId,
      cuit: formatCuit(row.cuit),
      businessName: normalizeText(row.businessName),
      values,
      cells: columns.map((column) => values[column.key] ?? '-')
    }
  })
}

export function mapSummaryBlocksToPreview(
  blocks: ICrossResumenBlock[] | null
): ICrossPreviewSummaryBlock[] {
  return (
    blocks?.map((block) => ({
      id: block.key,
      title: block.title,
      columns: block.columns,
      rows: block.rows.map((row, rowIndex) => ({
        id: `${block.key}-${rowIndex}`,
        values: mapDynamicRowValues(row, block.columns)
      }))
    })) ?? []
  )
}

export function mapAnalysisRowsToPreview(
  rows: ICrossAnalysisRow[],
  columns: ICrossDynamicColumn[]
): ICrossPreviewAnalysisRow[] {
  return rows.map((row, rowIndex) => {
    const values = Object.fromEntries(
      columns.map((column) => [column.key, resolveAnalysisCellValue(row, column)])
    )

    return {
      id: `${row.cuit}-${rowIndex}`,
      cuit: formatCuit(row.cuit),
      businessName: normalizeText(row.businessName),
      values,
      status: mapRelevanceStatus(row.relevanceStatus)
    }
  })
}

function resolveRelevantCountLabel(resumen: ICrossResumenData) {
  const count =
    resumen.metadata.relevantCuits ??
    resumen.analysis.rows.filter((row) => mapRelevanceStatus(row.relevanceStatus) === 'relevante')
      .length

  return count === 1 ? '1 relevante' : `${count} relevantes`
}

function resolvePagination(data: ICrossPaginationData): ICrossPaginationData {
  return {
    page: data.page,
    itemsPerPage: data.itemsPerPage,
    totalItems: data.totalItems,
    totalPages: data.totalPages
  }
}

export function mapCrossPreviewContractToView(
  executionId: number,
  planilla: ICrossPlanillaData,
  resumen: ICrossResumenData,
  execution?: ICrossManagementItem | null
): ICrossPreviewData {
  const planColumns = planilla.schema?.columns ?? []
  const analysisColumns = resumen.analysisSchema?.columns ?? []
  const totalCuits =
    resumen.metadata.totalCuits ||
    execution?.cuitCount ||
    planilla.totalItems ||
    resumen.analysis.totalItems

  return {
    id: String(executionId),
    executionId,
    name: resumen.metadata.title ?? execution?.name ?? `Cruce ${executionId}`,
    source: execution?.source ?? (totalCuits > 1 ? 'Lote' : 'Padrón'),
    sourceRef: resumen.metadata.batchOrCuit ?? execution?.sourceRef ?? '-',
    period: resumen.metadata.period ?? execution?.period ?? '-',
    cuitCount: totalCuits,
    date: execution?.date ?? '-',
    status: execution?.status ?? '-',
    relevantCountLabel: resolveRelevantCountLabel(resumen),
    indicators: CROSS_PREVIEW_INDICATORS,
    planColumns,
    planRows: mapPlanillaRowsToPreview(planilla.rows, planColumns),
    planPagination: resolvePagination(planilla),
    summaryBlocks: mapSummaryBlocksToPreview(resumen.summaryBlocks),
    analysisColumns,
    analysisRows: mapAnalysisRowsToPreview(resumen.analysis.rows, analysisColumns),
    analysisPagination: resolvePagination(resumen.analysis)
  }
}
