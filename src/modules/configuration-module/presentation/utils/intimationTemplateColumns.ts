import {
  INTIMATION_COLUMN_OPTIONS,
  type IntimationColumnOption
} from '../constants'
import type { IntimationTemplateColumn } from '../hooks/intimation-template/useIntimationTemplate'

const COLUMN_LABELS = new Map<string, string>(
  INTIMATION_COLUMN_OPTIONS.map((option) => [option.id, option.label])
)

export function getIntimationColumnLabel(
  columnId: string,
  columnOptions?: IntimationColumnOption[]
): string {
  const knownLabel =
    columnOptions?.find((option) => option.id === columnId)?.label ??
    COLUMN_LABELS.get(columnId)

  if (knownLabel) {
    return knownLabel
  }

  return columnId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function getIntimationColumnOptionById(
  columnId: string,
  columnOptions: IntimationColumnOption[] = INTIMATION_COLUMN_OPTIONS
): IntimationColumnOption | undefined {
  return columnOptions.find((option) => option.id === columnId)
}

export function getAvailableIntimationColumns(
  selectedColumns: IntimationTemplateColumn[],
  columnOptions: IntimationColumnOption[] = INTIMATION_COLUMN_OPTIONS
) {
  return columnOptions.filter(
    (option) => !selectedColumns.some((column) => column.id === option.id)
  )
}

export function reorderIntimationTemplateColumns(
  columns: IntimationTemplateColumn[],
  sourceColumnId: string,
  targetColumnId: string
) {
  if (sourceColumnId === targetColumnId) {
    return columns
  }

  const sourceIndex = columns.findIndex((column) => column.id === sourceColumnId)
  const targetIndex = columns.findIndex((column) => column.id === targetColumnId)

  if (sourceIndex === -1 || targetIndex === -1) {
    return columns
  }

  const reorderedColumns = [...columns]
  const [sourceColumn] = reorderedColumns.splice(sourceIndex, 1)
  reorderedColumns.splice(targetIndex, 0, sourceColumn)

  return reorderedColumns
}
