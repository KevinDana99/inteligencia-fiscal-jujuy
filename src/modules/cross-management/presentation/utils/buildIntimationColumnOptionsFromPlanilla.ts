import type { IntimationColumnOption } from '@/modules/configuration-module/presentation/constants'
import type {
  ICrossDynamicColumn,
  ICrossPreviewPlanRow
} from '../../data/models/CrossManagement'

const EMPTY_PLANILLA_VALUES = new Set(['', '-'])
const TECHNICAL_ID_LABEL_PATTERN = /^ID(?:$|[\s\d._-])/
const TECHNICAL_ID_KEY_PATTERN = /^id(?:$|[\d_\s.-])|(?:^|_)id(?:$|[\d_\s.-])/i

export function buildIntimationColumnOptionsFromPlanilla(
  columns: ICrossDynamicColumn[],
  rows: ICrossPreviewPlanRow[]
): IntimationColumnOption[] {
  const addedColumnIds = new Set<string>()

  return columns.reduce<IntimationColumnOption[]>((options, column) => {
    if (
      addedColumnIds.has(column.key) ||
      isTechnicalIdentifierColumn(column) ||
      !rows.some((row) => hasPlanillaColumnValue(row, column.key))
    ) {
      return options
    }

    addedColumnIds.add(column.key)
    options.push({
      id: column.key,
      label: column.label
    })

    return options
  }, [])
}

function isTechnicalIdentifierColumn(column: ICrossDynamicColumn) {
  return (
    TECHNICAL_ID_KEY_PATTERN.test(column.key) ||
    TECHNICAL_ID_LABEL_PATTERN.test(normalizeColumnLabel(column.label))
  )
}

function hasPlanillaColumnValue(row: ICrossPreviewPlanRow, columnKey: string) {
  const value: unknown = row.values[columnKey]

  if (value === null || typeof value === 'undefined') {
    return false
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
  }

  return !EMPTY_PLANILLA_VALUES.has(String(value).trim())
}

function normalizeColumnLabel(label: string) {
  return label
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toUpperCase()
}
