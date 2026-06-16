'use client'

import type { ICrossManagementListData } from '../../data/models/CrossManagement'
import { useCrossManagementFilters } from './cross-management/useCrossManagementFilters'
import { useCrossManagementNavigation } from './cross-management/useCrossManagementNavigation'
import { useCrossManagementPolling } from './cross-management/useCrossManagementPolling'

export function useCrossManagement(
  initialCrossData?: ICrossManagementListData | null
) {
  const polling = useCrossManagementPolling(initialCrossData)
  const filters = useCrossManagementFilters(polling.crossData)
  const { openCrossPreview } = useCrossManagementNavigation()

  return {
    ...filters,
    pollingError: polling.pollingError,
    refreshCrossData: polling.refreshCrossData,
    openCrossPreview
  }
}
