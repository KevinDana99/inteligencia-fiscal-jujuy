'use client'

import { useCallback, useMemo, useState } from 'react'
import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import { generateIntimationDocumentAction } from '../../../data/actions'
import {
  INTIMATION_DOCUMENT_FORMATS
} from '../../../data/constants/intimationDocumentContracts'
import type { IIntimationDocumentFormat } from '../../../data/models/CrossManagement'
import { normalizeIntimationDocumentPayload } from '../../../data/utils/normalizeIntimationDocumentPayload'
import { INTIMATION_DOCUMENT_DOWNLOAD_ERRORS } from '../../constants/intimationDocumentDownload'
import { downloadIntimationDocument } from '../../utils/intimationDocumentDownload'
import { buildIntimationDocumentPayload } from '../../utils/intimationDocumentPayload'
import type { IntimationExportContributor } from './useIntimationExportModal'

interface UseIntimationDocumentDownloadParams {
  activeIndex: number
  contributors: IntimationExportContributor[]
  templateState: IntimationTemplateState
}

function resolveDownloadError(error: unknown) {
  return error instanceof Error
    ? error.message
    : INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.downloadFailed
}

export function useIntimationDocumentDownload({
  activeIndex,
  contributors,
  templateState
}: UseIntimationDocumentDownloadParams) {
  const [downloadingFormat, setDownloadingFormat] =
    useState<IIntimationDocumentFormat | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const currentContributor = useMemo(
    () => contributors[Math.min(Math.max(activeIndex, 0), contributors.length - 1)],
    [activeIndex, contributors]
  )

  const downloadDocument = useCallback(
    async (format: IIntimationDocumentFormat) => {
      if (downloadingFormat) {
        return
      }

      setDownloadError(null)
      setDownloadingFormat(format)

      try {
        const payload = buildIntimationDocumentPayload({
          contributor: currentContributor,
          format,
          templateState
        })
        const normalizedPayload = normalizeIntimationDocumentPayload(payload)
        const result = await generateIntimationDocumentAction(normalizedPayload)

        if (!result.success || !result.data) {
          throw new Error(
            result.error ?? INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed
          )
        }

        await downloadIntimationDocument({
          documentId: result.data.documentId,
          format
        })
      } catch (error) {
        setDownloadError(resolveDownloadError(error))
      } finally {
        setDownloadingFormat(null)
      }
    },
    [currentContributor, downloadingFormat, templateState]
  )

  const downloadPdf = useCallback(() => {
    void downloadDocument(INTIMATION_DOCUMENT_FORMATS.PDF)
  }, [downloadDocument])

  const downloadDocx = useCallback(() => {
    void downloadDocument(INTIMATION_DOCUMENT_FORMATS.DOCX)
  }, [downloadDocument])

  return {
    downloadDocx,
    downloadError,
    downloadPdf,
    isDocxDownloading: downloadingFormat === INTIMATION_DOCUMENT_FORMATS.DOCX,
    isDownloadDisabled: Boolean(downloadingFormat),
    isPdfDownloading: downloadingFormat === INTIMATION_DOCUMENT_FORMATS.PDF
  }
}
