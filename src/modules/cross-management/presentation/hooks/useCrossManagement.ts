'use client'

import { useState } from 'react'
import type { ICrossManagementListData } from '../../data/models/CrossManagement'
import { useCrossManagementFilters } from './cross-management/useCrossManagementFilters'
import { useCrossManagementNavigation } from './cross-management/useCrossManagementNavigation'
import { useCrossManagementPolling } from './cross-management/useCrossManagementPolling'

export function useCrossManagement(
  initialCrossData?: ICrossManagementListData | null
) {
  const [searchValue, setSearchValue] = useState('')
  const polling = useCrossManagementPolling({
    initialCrossData,
    searchValue
  })
  const filters = useCrossManagementFilters({
    crossData: polling.crossData,
    searchValue,
    setSearchValue
  })
  const { openCrossPreview } = useCrossManagementNavigation()

  return {
    ...filters,
    pollingError: polling.pollingError,
    refreshCrossData: polling.refreshCrossData,
    openCrossPreview
  }
}
