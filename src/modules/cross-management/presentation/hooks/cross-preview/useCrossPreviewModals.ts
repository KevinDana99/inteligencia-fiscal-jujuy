'use client'

import { useCallback } from 'react'
import { useIntimationTemplate } from '@/modules/configuration-module/presentation/components/IntimationTemplate/useIntimationTemplate'
import type { IntimationExportContributor } from '../intimation-export/useIntimationExportModal'
import { useIntimationDocumentDownload } from '../intimation-export/useIntimationDocumentDownload'

interface UseCrossPreviewModalsParams {
  activePreviewIndex: number
  contributors: IntimationExportContributor[]
  onConfirmReprocessingModal: () => void
  onOpenExportModal: () => void
}

export function useCrossPreviewModals({
  activePreviewIndex,
  contributors,
  onConfirmReprocessingModal,
  onOpenExportModal
}: UseCrossPreviewModalsParams) {
  const intimationTemplate = useIntimationTemplate()
  const documentDownload = useIntimationDocumentDownload({
    activeIndex: activePreviewIndex,
    contributors,
    templateState: intimationTemplate.state
  })

  const handleIntimationNext = useCallback(() => {
    onOpenExportModal()
  }, [onOpenExportModal])

  const handleConfirmReprocessing = useCallback(async () => {
    onConfirmReprocessingModal()
  }, [onConfirmReprocessingModal])

  return {
    ...documentDownload,
    handleConfirmReprocessing,
    handleIntimationNext,
    intimationTemplate
  }
}
