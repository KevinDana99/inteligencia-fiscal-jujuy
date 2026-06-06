import type { ICrossManagementItems } from '../../data/models/CrossManagement'
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
  const normalizedSearch = searchValue.trim().toLowerCase()

  return items.filter((item) => {
    const matchesSearch =
      !normalizedSearch ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.sourceRef.toLowerCase().includes(normalizedSearch)
    const matchesDays = matchesCrossManagementDayRange({
      itemDate: item.date,
      selectedRange: dayRangeValue
    })
    const matchesPeriod = matchesCrossManagementPeriod({
      itemPeriod: item.period,
      selectedPeriod: periodValue
    })

    return matchesSearch && matchesDays && matchesPeriod
  })
}
