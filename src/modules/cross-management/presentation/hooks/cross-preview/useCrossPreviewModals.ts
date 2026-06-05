'use client'

import { useCallback } from 'react'
import { useIntimationTemplate } from '@/modules/configuration-module/presentation/components/IntimationTemplate/useIntimationTemplate'

interface UseCrossPreviewModalsParams {
  onConfirmReprocessingModal: () => void
  onOpenExportModal: () => void
}

export function useCrossPreviewModals({
  onConfirmReprocessingModal,
  onOpenExportModal
}: UseCrossPreviewModalsParams) {
  const intimationTemplate = useIntimationTemplate()

  const handleIntimationNext = useCallback(() => {
    onOpenExportModal()
  }, [onOpenExportModal])

  const handleConfirmReprocessing = useCallback(async () => {
    onConfirmReprocessingModal()
  }, [onConfirmReprocessingModal])

  return {
    handleConfirmReprocessing,
    handleIntimationNext,
    intimationTemplate
  }
}
