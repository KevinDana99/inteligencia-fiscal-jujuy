'use client'

import { useCallback, useState } from 'react'

export type CrossPreviewTab = 'planilla' | 'resumen'

export function useCrossPreviewTabs() {
  const [activeTab, setActiveTab] = useState<CrossPreviewTab>('planilla')
  const [planillaSearch, setPlanillaSearch] = useState('')
  const [resumenSearch, setResumenSearch] = useState('')

  const updateTab = useCallback((tab: CrossPreviewTab) => {
    setActiveTab(tab)

    if (tab === 'planilla') {
      setPlanillaSearch('')
      return
    }

    setResumenSearch('')
  }, [])

  return {
    activeTab,
    isPlanilla: activeTab === 'planilla',
    planillaSearch,
    resumenSearch,
    setPlanillaSearch,
    setResumenSearch,
    updateTab
  }
}
