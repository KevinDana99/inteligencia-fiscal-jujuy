'use client'

import type { ICrossManagementListData } from '../../data/models/CrossManagement'
import { useCrossManagementFilters } from './cross-management/useCrossManagementFilters'
import { useCrossManagementNavigation } from './cross-management/useCrossManagementNavigation'

export function useCrossManagement(
  initialCrossData?: ICrossManagementListData | null
) {
  const filters = useCrossManagementFilters(initialCrossData)
  const { openCrossPreview } = useCrossManagementNavigation()

  return {
    ...filters,
    openCrossPreview
  }
}
