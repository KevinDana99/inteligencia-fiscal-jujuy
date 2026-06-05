'use client'

import { useCallback } from 'react'
import type { CrossPreviewTab } from './useCrossPreviewTabs'

interface UseCrossPreviewTopBarParams {
  activeTab: CrossPreviewTab
  onUpdateTab: (tab: CrossPreviewTab) => void
}

export function useCrossPreviewTopBar({
  activeTab,
  onUpdateTab
}: UseCrossPreviewTopBarParams) {
  const isPlanilla = activeTab === 'planilla'
  const handleShowPlanilla = useCallback(() => {
    onUpdateTab('planilla')
  }, [onUpdateTab])
  const handleShowResumen = useCallback(() => {
    onUpdateTab('resumen')
  }, [onUpdateTab])

  return {
    handleShowPlanilla,
    handleShowResumen,
    isPlanilla,
    shouldShowIntimationButton: !isPlanilla
  }
}
