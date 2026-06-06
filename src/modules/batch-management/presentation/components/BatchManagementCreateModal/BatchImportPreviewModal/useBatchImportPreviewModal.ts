'use client'

import { useState } from 'react'
import type { IBatchPreviewData } from '../../../../data/models/BatchManagement'

type UseBatchImportPreviewModalParams = {
  previewData: IBatchPreviewData | null
  onConfirm: (acceptedNormalizedCuits?: string[]) => void
}

export function useBatchImportPreviewModal({
  previewData,
  onConfirm
}: UseBatchImportPreviewModalParams) {
  const [acceptedNormalizedCuits, setAcceptedNormalizedCuits] = useState<string[]>([])

  function toggleAcceptedNormalizedCuit(normalizedCuit: string) {
    setAcceptedNormalizedCuits((current) =>
      current.includes(normalizedCuit)
        ? current.filter((item) => item !== normalizedCuit)
        : [...current, normalizedCuit]
    )
  }

  function handleConfirm() {
    onConfirm(acceptedNormalizedCuits)
  }

  const validCount = previewData?.validCount ?? 0
  const invalidCount =
    (previewData?.invalidCount ?? 0) + (previewData?.duplicatedCount ?? 0)
  const suggestedCount = acceptedNormalizedCuits.length
  const importCount = validCount + suggestedCount

  return {
    validCount,
    invalidCount,
    importCount,
    rows:
      previewData?.records.map((row) => {
        const isInvalid = row.status !== 'valid'
        const normalizedSuggestion = row.normalizedCuit?.trim() ?? ''
        const hasNormalizedSuggestion =
          isInvalid &&
          row.status !== 'duplicated' &&
          Boolean(normalizedSuggestion)

        return {
          id: `${row.record}-${row.originalCuit}`,
          record: row.record,
          originalCuit: row.originalCuit,
          businessName: row.businessName ?? '—',
          isInvalid,
          normalizedSuggestion,
          hasNormalizedSuggestion,
          isSuggestionAccepted: acceptedNormalizedCuits.includes(normalizedSuggestion),
          stateLabel:
            row.status === 'duplicated'
              ? '✕ Duplicado'
              : isInvalid
                ? '✕ Inválido'
                : '✓ Válido',
          onSuggestionToggle: () => toggleAcceptedNormalizedCuit(normalizedSuggestion)
        }
      }) ?? [],
    handleConfirm
  }
}

export type ReturnTypeOfUseBatchImportPreviewModal = ReturnType<
  typeof useBatchImportPreviewModal
>
