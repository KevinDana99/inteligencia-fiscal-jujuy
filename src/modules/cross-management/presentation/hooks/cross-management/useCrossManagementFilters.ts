'use client'

import { useMemo, useState } from 'react'
import type { ICrossManagementListData } from '../../../data/models/CrossManagement'
import {
  CROSS_MANAGEMENT_DAY_RANGE_OPTIONS,
  CROSS_MANAGEMENT_PERIOD_OPTIONS
} from '../../constants/crossManagementFilters'
import { filterCrossManagementItems } from '../../utils/filterCrossManagementItems'

interface UseCrossManagementFiltersParams {
  crossData?: ICrossManagementListData | null
  searchValue: string
  setSearchValue: (value: string) => void
}

export function useCrossManagementFilters({
  crossData,
  searchValue,
  setSearchValue
}: UseCrossManagementFiltersParams) {
  const [periodValue, setPeriodValue] = useState('')
  const [dayRangeValue, setDayRangeValue] = useState('')

  const items = useMemo(
    () =>
      filterCrossManagementItems({
        dayRangeValue,
        items: crossData?.items ?? [],
        periodValue,
        searchValue
      }),
    [dayRangeValue, crossData, periodValue, searchValue]
  )

  return {
    dayRangeOptions: CROSS_MANAGEMENT_DAY_RANGE_OPTIONS,
    dayRangeValue,
    items,
    periodOptions: CROSS_MANAGEMENT_PERIOD_OPTIONS,
    periodValue,
    searchValue,
    setDayRangeValue,
    setPeriodValue,
    setSearchValue,
    total: items.length
  }
}
