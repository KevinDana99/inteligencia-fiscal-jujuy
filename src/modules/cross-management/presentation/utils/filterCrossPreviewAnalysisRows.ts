import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
  ICrossFilterColumnKey,
  ICrossPreviewAnalysisRow
} from '../../data/models/CrossManagement'
import { matchesCrossPreviewFilterCondition } from './matchesCrossPreviewFilterCondition'

function matchesColumnFilter(
  row: ICrossPreviewAnalysisRow,
  columnKey: ICrossFilterColumnKey,
  filter: ICrossColumnFilterState
) {
  const primaryMatches = matchesCrossPreviewFilterCondition(
    row[columnKey],
    filter.primary
  )
  const hasSecondaryFilter =
    Boolean(filter.secondary.operator) && Boolean(filter.secondary.value.trim())

  if (!hasSecondaryFilter) {
    return primaryMatches
  }

  const secondaryMatches = matchesCrossPreviewFilterCondition(
    row[columnKey],
    filter.secondary
  )

  return filter.connector === 'Y'
    ? primaryMatches && secondaryMatches
    : primaryMatches || secondaryMatches
}

export function filterCrossPreviewAnalysisRows(
  rows: ICrossPreviewAnalysisRow[],
  filters: ICrossColumnFilters
) {
  const activeFilters = Object.entries(filters) as Array<
    [ICrossFilterColumnKey, ICrossColumnFilterState | undefined]
  >

  return rows.filter((row) =>
    activeFilters.every(([columnKey, filter]) =>
      filter ? matchesColumnFilter(row, columnKey, filter) : true
    )
  )
}
