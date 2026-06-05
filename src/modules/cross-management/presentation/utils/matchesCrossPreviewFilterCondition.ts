import type { ICrossFilterCondition } from '../../data/models/CrossManagement'
import { parseCrossPreviewFilterNumber } from './parseCrossPreviewFilterNumber'

export function matchesCrossPreviewFilterCondition(
  value: string,
  condition: ICrossFilterCondition
) {
  if (!condition.operator || !condition.value.trim()) {
    return true
  }

  const rowValue = parseCrossPreviewFilterNumber(value)
  const filterValue = parseCrossPreviewFilterNumber(condition.value)

  if (rowValue === null || filterValue === null) {
    return false
  }

  switch (condition.operator) {
    case 'mayor':
      return rowValue > filterValue
    case 'mayor_igual':
      return rowValue >= filterValue
    case 'menor':
      return rowValue < filterValue
    case 'menor_igual':
      return rowValue <= filterValue
    case 'igual':
      return rowValue === filterValue
    case 'distinto':
      return rowValue !== filterValue
    default:
      return true
  }
}
