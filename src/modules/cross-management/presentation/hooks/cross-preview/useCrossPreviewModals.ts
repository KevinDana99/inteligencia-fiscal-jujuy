'use client'

import { useCallback } from 'react'
import { useIntimationTemplate } from '@/modules/configuration-module/presentation/components/IntimationTemplate/useIntimationTemplate'
import type { IntimationColumnOption } from '@/modules/configuration-module/presentation/constants'
import type { IReprocessingMarkPayload } from '@/modules/reprocessing/data/models/Reprocessing'
import type { IntimationExportContributor } from '../intimation-export/useIntimationExportModal'
import { useIntimationDocumentDownload } from '../intimation-export/useIntimationDocumentDownload'

interface UseCrossPreviewModalsParams {
  activePreviewIndex: number
  intimationColumnOptions: IntimationColumnOption[]
  contributors: IntimationExportContributor[]
  onConfirmReprocessingModal: (
    payload: IReprocessingMarkPayload
  ) => void | Promise<void>
  onOpenExportModal: () => void
}

export function useCrossPreviewModals({
  activePreviewIndex,
  intimationColumnOptions,
  contributors,
  onConfirmReprocessingModal,
  onOpenExportModal
}: UseCrossPreviewModalsParams) {
  const intimationTemplate = useIntimationTemplate({
    columnOptions: intimationColumnOptions
  })
  const documentDownload = useIntimationDocumentDownload({
    activeIndex: activePreviewIndex,
    contributors,
    templateState: intimationTemplate.state
  })

  const handleIntimationNext = useCallback(() => {
    onOpenExportModal()
  }, [onOpenExportModal])

  const handleConfirmReprocessing = useCallback(async (
    payload: IReprocessingMarkPayload
  ) => {
    await onConfirmReprocessingModal(payload)
  }, [onConfirmReprocessingModal])

  return {
    ...documentDownload,
    handleConfirmReprocessing,
    handleIntimationNext,
    intimationTemplate
  }
}
