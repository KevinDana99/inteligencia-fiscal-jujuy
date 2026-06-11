'use client'

import { useCallback, useState } from 'react'

interface UseCrossPreviewModalStateParams {
  maxPreviewIndex: number
}

export function useCrossPreviewModalState({
  maxPreviewIndex
}: UseCrossPreviewModalStateParams) {
  const [intimationModalOpened, setIntimationModalOpened] = useState(false)
  const [exportModalOpened, setExportModalOpened] = useState(false)
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)

  const openIntimationModal = useCallback(() => {
    setIntimationModalOpened(true)
  }, [])

  const closeIntimationModal = useCallback(() => {
    setIntimationModalOpened(false)
  }, [])

  const openExportModal = useCallback(() => {
    setExportModalOpened(true)
  }, [])

  const closeExportModal = useCallback(() => {
    setExportModalOpened(false)
  }, [])

  const goToPreviousPreview = useCallback(() => {
    setActivePreviewIndex((current) => Math.max(current - 1, 0))
  }, [])

  const goToNextPreview = useCallback(() => {
    setActivePreviewIndex((current) => Math.min(current + 1, maxPreviewIndex))
  }, [maxPreviewIndex])

  return {
    activePreviewIndex,
    closeExportModal,
    closeIntimationModal,
    exportModalOpened,
    goToNextPreview,
    goToPreviousPreview,
    intimationModalOpened,
    openExportModal,
    openIntimationModal
  }
}
