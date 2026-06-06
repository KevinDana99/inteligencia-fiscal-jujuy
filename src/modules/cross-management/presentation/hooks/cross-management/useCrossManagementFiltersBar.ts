'use client'

import { useCallback } from 'react'
import type { ChangeEvent } from 'react'

interface UseCrossManagementFiltersBarParams {
  setDayRangeValue: (value: string) => void
  setPeriodValue: (value: string) => void
  setSearchValue: (value: string) => void
}

export function useCrossManagementFiltersBar({
  setDayRangeValue,
  setPeriodValue,
  setSearchValue
}: UseCrossManagementFiltersBarParams) {
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.currentTarget.value)
    },
    [setSearchValue]
  )

  const handlePeriodChange = useCallback(
    (value: string | null) => {
      setPeriodValue(value ?? '')
    },
    [setPeriodValue]
  )

  const handleDayRangeChange = useCallback(
    (value: string | null) => {
      setDayRangeValue(value ?? '')
    },
    [setDayRangeValue]
  )

  return {
    handleDayRangeChange,
    handlePeriodChange,
    handleSearchChange
  }
}
