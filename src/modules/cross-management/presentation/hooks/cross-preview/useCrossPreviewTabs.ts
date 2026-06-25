'use client'

import { useCallback, useMemo, useState } from 'react'
import type { ICrossAvailableView } from '../../../data/models/CrossManagement'

export type CrossPreviewTab = ICrossAvailableView

export function useCrossPreviewTabs(viewsAvailable: ICrossAvailableView[]) {
  const availableTabs = useMemo<ICrossAvailableView[]>(
    () => (viewsAvailable.length ? viewsAvailable : ['resumen']),
    [viewsAvailable]
  )
  const [activeTab, setActiveTab] = useState<CrossPreviewTab>(availableTabs[0])

  const updateTab = useCallback(
    (tab: CrossPreviewTab) => {
      if (availableTabs.includes(tab)) {
        setActiveTab(tab)
      }
    },
    [availableTabs]
  )

  return {
    activeTab,
    availableTabs,
    isPlanilla: activeTab === 'planilla',
    updateTab
  }
}
