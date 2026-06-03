'use client'

import { useMemo, useState } from 'react'
import type { ICrossPreviewData } from '../../data/models/CrossManagement'

export type CrossPreviewTab = 'planilla' | 'resumen'

function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}

function matchesSearch(cuit: string, businessName: string, search: string) {
  const normalizedSearch = normalizeSearch(search)

  if (!normalizedSearch) {
    return true
  }

  return (
    cuit.toLowerCase().includes(normalizedSearch) ||
    businessName.toLowerCase().includes(normalizedSearch)
  )
}

export function useCrossPreview(cross: ICrossPreviewData) {
  const [activeTab, setActiveTab] = useState<CrossPreviewTab>('planilla')
  const [planillaSearch, setPlanillaSearch] = useState('')
  const [resumenSearch, setResumenSearch] = useState('')

  const filteredPlanRows = useMemo(
    () =>
      cross.planRows.filter((row) =>
        matchesSearch(row.cuit, row.businessName, planillaSearch)
      ),
    [cross.planRows, planillaSearch]
  )

  const filteredAnalysisRows = useMemo(
    () =>
      cross.analysisRows.filter((row) =>
        matchesSearch(row.cuit, row.businessName, resumenSearch)
      ),
    [cross.analysisRows, resumenSearch]
  )

  const updateTab = (tab: CrossPreviewTab) => {
    setActiveTab(tab)

    if (tab === 'planilla') {
      setPlanillaSearch('')
      return
    }

    setResumenSearch('')
  }

  return {
    activeTab,
    planillaSearch,
    resumenSearch,
    filteredPlanRows,
    filteredAnalysisRows,
    updateTab,
    setPlanillaSearch,
    setResumenSearch
  }
}
