'use client'

import { useCallback } from 'react'
import type { CrossPreviewTab } from './useCrossPreviewTabs'

interface UseCrossPreviewTopBarParams {
  activeTab: CrossPreviewTab
  availableTabs: CrossPreviewTab[]
  onUpdateTab: (tab: CrossPreviewTab) => void
}

export function useCrossPreviewTopBar({
  activeTab,
  availableTabs,
  onUpdateTab
}: UseCrossPreviewTopBarParams) {
  const isPlanilla = activeTab === 'planilla'
  const hasPlanilla = availableTabs.includes('planilla')
  const handleShowPlanilla = useCallback(() => {
    onUpdateTab('planilla')
  }, [onUpdateTab])
  const handleShowResumen = useCallback(() => {
    onUpdateTab('resumen')
  }, [onUpdateTab])

  return {
    handleShowPlanilla,
    handleShowResumen,
    hasPlanilla,
    isPlanilla,
    shouldShowIntimationButton: !isPlanilla && hasPlanilla
  }
}
