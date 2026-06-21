import type { ICrossManagementItems } from '../../data/models/CrossManagement'
import { matchesCrossSearch } from '../../data/utils/crossSearch'
import { matchesCrossManagementDayRange } from './matchesCrossManagementDayRange'
import { matchesCrossManagementPeriod } from './matchesCrossManagementPeriod'

interface FilterCrossManagementItemsParams {
  dayRangeValue: string
  items: ICrossManagementItems
  periodValue: string
  searchValue: string
}

export function filterCrossManagementItems({
  dayRangeValue,
  items,
  periodValue,
  searchValue
}: FilterCrossManagementItemsParams) {
  return items.filter((item) => {
    const matchesDays = matchesCrossManagementDayRange({
      itemDate: item.date,
      selectedRange: dayRangeValue
    })
    const matchesPeriod = matchesCrossManagementPeriod({
      itemPeriod: item.period,
      selectedPeriod: periodValue
    })
    const matchesSearch = matchesCrossSearch(
      [item.name, item.source, item.sourceRef],
      searchValue
    )

    return matchesDays && matchesPeriod && matchesSearch
  })
}
