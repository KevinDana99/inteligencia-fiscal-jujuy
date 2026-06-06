import type {
  ICrossDynamicColumn,
  ICrossDynamicValuesRow
} from '../models/CrossManagement'

const EMPTY_VALUE_LABEL = '-'

function formatDateValue(value: string) {
  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

export function formatCrossPreviewValue(
  value: number | string | null | undefined,
  column: Pick<ICrossDynamicColumn, 'type'>
) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return EMPTY_VALUE_LABEL
  }

  if (column.type === 'fecha') {
    return typeof value === 'string' ? formatDateValue(value) : String(value)
  }

  if (column.type === 'numero') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return String(value)
    }

    return new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: 6
    }).format(value)
  }

  return String(value)
}

export function mapDynamicRowValue(
  row: ICrossDynamicValuesRow,
  column: ICrossDynamicColumn
) {
  if (column.type === 'string') {
    return formatCrossPreviewValue(row.texts[column.key], column)
  }

  if (column.type === 'fecha') {
    return formatCrossPreviewValue(row.dates[column.key], column)
  }

  return formatCrossPreviewValue(row.metrics[column.key], column)
}

export function mapDynamicRowValues(
  row: ICrossDynamicValuesRow,
  columns: ICrossDynamicColumn[]
) {
  return Object.fromEntries(
    columns.map((column) => [column.key, mapDynamicRowValue(row, column)])
  )
}
