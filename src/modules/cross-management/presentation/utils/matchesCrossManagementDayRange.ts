import { parseCrossManagementDate } from './parseCrossManagementDate'

interface MatchesCrossManagementDayRangeParams {
  itemDate: string
  selectedRange: string
}

export function matchesCrossManagementDayRange({
  itemDate,
  selectedRange
}: MatchesCrossManagementDayRangeParams) {
  if (!selectedRange) {
    return true
  }

  const diffMs = Date.now() - parseCrossManagementDate(itemDate)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return diffDays <= Number(selectedRange)
}
