'use client'

import { useCallback, useState } from 'react'

export type CrossPreviewTab = 'planilla' | 'resumen'

export function useCrossPreviewTabs() {
  const [activeTab, setActiveTab] = useState<CrossPreviewTab>('planilla')

  const updateTab = useCallback((tab: CrossPreviewTab) => {
    setActiveTab(tab)
  }, [])

  return {
    activeTab,
    isPlanilla: activeTab === 'planilla',
    updateTab
  }
}
