'use server'

import { crossPreviewMockById } from '../../sources/mock/fixtures/crossItems'
import type {
  ICrossAnalysisFilterData,
  ICrossAnalysisFilterPayload,
  ICrossAnalysisFilterQueryResult,
  ICrossColumnFilterState,
  ICrossFilterColumnKey,
  ICrossFilterCondition,
  ICrossPreviewAnalysisRow
} from '../../models/CrossManagement'
import { resolveCrossManagementActionError } from '../shared/resolveCrossManagementActionError'

function parseNumericValue(rawValue: string): number {
  const normalizedValue = rawValue
    .trim()
    .replace(/\s+/g, '')
    .replace(/\$/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')

  return Number.parseFloat(normalizedValue || '0')
}

function getRowNumericValue(
  row: ICrossPreviewAnalysisRow,
  columnKey: ICrossFilterColumnKey
): number {
  return parseNumericValue(row[columnKey])
}

function isConditionActive(condition: ICrossFilterCondition): boolean {
  return Boolean(condition.operator) && condition.value.trim() !== ''
}

function matchesCondition(
  rowValue: number,
  condition: ICrossFilterCondition
): boolean {
  const targetValue = Number.parseFloat(condition.value)

  if (!condition.operator || Number.isNaN(targetValue)) {
    return true
  }

  switch (condition.operator) {
    case 'mayor':
      return rowValue > targetValue
    case 'mayor_igual':
      return rowValue >= targetValue
    case 'menor':
      return rowValue < targetValue
    case 'menor_igual':
      return rowValue <= targetValue
    case 'igual':
      return rowValue === targetValue
    case 'distinto':
      return rowValue !== targetValue
    default:
      return true
  }
}

function matchesColumnFilter(
  row: ICrossPreviewAnalysisRow,
  columnKey: ICrossFilterColumnKey,
  filter: ICrossColumnFilterState
): boolean {
  const rowValue = getRowNumericValue(row, columnKey)
  const primaryActive = isConditionActive(filter.primary)
  const secondaryActive = isConditionActive(filter.secondary)

  if (!primaryActive && !secondaryActive) {
    return true
  }

  const primaryMatches = primaryActive
    ? matchesCondition(rowValue, filter.primary)
    : true
  const secondaryMatches = secondaryActive
    ? matchesCondition(rowValue, filter.secondary)
    : true

  if (!secondaryActive) {
    return primaryMatches
  }

  return filter.connector === 'Y'
    ? primaryMatches && secondaryMatches
    : primaryMatches || secondaryMatches
}

function filterAnalysisRows(
  rows: ICrossPreviewAnalysisRow[],
  filters: ICrossAnalysisFilterPayload['filters']
): ICrossPreviewAnalysisRow[] {
  return rows.filter((row) =>
    Object.entries(filters).every(([columnKey, filterState]) => {
      if (!filterState) {
        return true
      }

      return matchesColumnFilter(
        row,
        columnKey as ICrossFilterColumnKey,
        filterState
      )
    })
  )
}

export async function filterCrossAnalysisAction(
  payload: ICrossAnalysisFilterPayload
): Promise<ICrossAnalysisFilterQueryResult> {
  try {
    const cross = crossPreviewMockById[payload.crossId]

    if (!cross) {
      throw new Error('No fue posible encontrar el cruce solicitado.')
    }

    const data: ICrossAnalysisFilterData = {
      rows: filterAnalysisRows(cross.analysisRows, payload.filters)
    }

    return { data }
  } catch (error) {
    return {
      data: null,
      ...resolveCrossManagementActionError(
        error,
        'No fue posible filtrar la tabla de análisis.'
      )
    }
  }
}
