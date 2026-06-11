'use client'

import { useState, useTransition } from 'react'
import { previewBatchLoadAction } from '../../../data/actions'
import type { IBatchPreviewData } from '../../../data/models/BatchManagement'

type UseBatchManagementImportPreviewParams = {
  regime: string | null
}

export function useBatchManagementImportPreview({
  regime
}: UseBatchManagementImportPreviewParams) {
  const [previewData, setPreviewData] = useState<IBatchPreviewData | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false)
  const [isPreviewPending, startPreviewTransition] = useTransition()

  function resetImportPreview() {
    setPreviewData(null)
    setPreviewError(null)
    setIsImportPreviewOpen(false)
  }

  function closeImportPreview() {
    setIsImportPreviewOpen(false)
  }

  function openImportPreview(file: File) {
    setPreviewError(null)

    startPreviewTransition(() => {
      void (async () => {
        const result = await previewBatchLoadAction({
          file,
          regime,
          cuitsText: null
        })

        if (!result.success || !result.data) {
          setPreviewData(null)
          setIsImportPreviewOpen(false)
          setPreviewError(
            result.error ?? 'No fue posible previsualizar el archivo importado.'
          )
          return
        }

        setPreviewData(result.data)
        setPreviewError(null)
        setIsImportPreviewOpen(true)
      })()
    })
  }

  return {
    previewData,
    previewError,
    isImportPreviewOpen,
    isPreviewPending,
    openImportPreview,
    closeImportPreview,
    resetImportPreview
  }
}
