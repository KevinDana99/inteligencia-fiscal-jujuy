import type {
  IGenerateIntimationDocumentPayload,
  IIntimationSpreadsheetCellValue,
  IIntimationSpreadsheetRow
} from '../models/CrossManagement'

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

function normalizeCurrencyValue(value: IIntimationSpreadsheetCellValue) {
  const trimmedValue = String(value ?? '').trim()
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

function normalizeSpreadsheetRow(
  row: IIntimationSpreadsheetRow
): IIntimationSpreadsheetRow {
  return Object.fromEntries(
    Object.entries(row).map(([columnId, value]) => [
      columnId,
      CURRENCY_COLUMN_IDS.has(columnId) ? normalizeCurrencyValue(value) : value
    ])
  )
}

export function normalizeIntimationDocumentPayload(
  payload: IGenerateIntimationDocumentPayload
): IGenerateIntimationDocumentPayload {
  return {
    ...payload,
    filasPlanilla: payload.filasPlanilla.map(normalizeSpreadsheetRow)
  }
}
