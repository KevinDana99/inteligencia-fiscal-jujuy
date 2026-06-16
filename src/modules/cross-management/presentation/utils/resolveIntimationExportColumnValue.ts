import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import { INTIMATION_EXPORT_COLUMN_CELL_INDEX_BY_ID } from '../constants/intimationExportColumns'
import { INTIMATION_EXPORT_EMPTY_VALUE } from '../constants/intimationExportLabels'

type IntimationExportContributor = Pick<
  ICrossPreviewPlanRow,
  'id' | 'cuit' | 'businessName' | 'cells' | 'values'
>

const YEAR_COLUMN_IDS = new Set(['anio'])
const CURRENCY_COLUMN_IDS = new Set([
  'base-interna',
  'base-terceros',
  'diferencia-base',
  'baseImponibleIngresosBrutos',
  'baseImponibleInformadaPorTerceros',
  'diferenciaBaseImponible',
  'base_imponible_ingresos_brutos',
  'base_imponible_informada_por_terceros',
  'diferencia_de_base_imponible'
])

function normalizeYearValue(value: string) {
  const digits = value.replace(/\D/g, '')

  return digits.length === 4 ? digits : value
}

function normalizeCurrencyValue(value: string) {
  const trimmedValue = value.trim()
  const valueWithoutCurrencySigns = trimmedValue.replace(/\$/g, '').trim()
  const isNegative =
    trimmedValue.startsWith('-') || valueWithoutCurrencySigns.startsWith('-')
  const unsignedValue = valueWithoutCurrencySigns.replace(/^-+\s*/, '').trim()

  if (!/\d/.test(unsignedValue)) {
    return '$ 0'
  }

  if (isNegative && unsignedValue !== '0') {
    return `-$ ${unsignedValue}`
  }

  return `$ ${unsignedValue}`
}

function normalizeColumnValue(columnId: string, value: string) {
  if (YEAR_COLUMN_IDS.has(columnId)) {
    return normalizeYearValue(value)
  }

  if (CURRENCY_COLUMN_IDS.has(columnId)) {
    return normalizeCurrencyValue(value)
  }

  return value
}

export function resolveIntimationExportColumnValue(
  contributor: IntimationExportContributor | undefined,
  columnId: string
) {
  if (!contributor) {
    return INTIMATION_EXPORT_EMPTY_VALUE
  }

  const valueByKey = contributor.values[columnId]

  if (valueByKey) {
    return normalizeColumnValue(columnId, valueByKey)
  }

  const index = INTIMATION_EXPORT_COLUMN_CELL_INDEX_BY_ID[columnId]

  if (typeof index !== 'number') {
    return INTIMATION_EXPORT_EMPTY_VALUE
  }

  return normalizeColumnValue(
    columnId,
    contributor.cells[index] ?? INTIMATION_EXPORT_EMPTY_VALUE
  )
}
