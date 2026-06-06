import {
  INTIMATION_COLUMN_OPTIONS,
  type IntimationColumnOption
} from '../constants'
import type { IntimationTemplateColumn } from '../hooks/intimation-template/useIntimationTemplate'

const COLUMN_LABELS = new Map<string, string>(
  INTIMATION_COLUMN_OPTIONS.map((option) => [option.id, option.label])
)

export function getIntimationColumnLabel(columnId: string): string {
  const knownLabel = COLUMN_LABELS.get(columnId)

  if (knownLabel) {
    return knownLabel
  }

  return columnId
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function getIntimationColumnOptionById(
  columnId: string
): IntimationColumnOption | undefined {
  return INTIMATION_COLUMN_OPTIONS.find((option) => option.id === columnId)
}

export function getAvailableIntimationColumns(
  selectedColumns: IntimationTemplateColumn[]
) {
  return INTIMATION_COLUMN_OPTIONS.filter(
    (option) => !selectedColumns.some((column) => column.id === option.id)
  )
}
