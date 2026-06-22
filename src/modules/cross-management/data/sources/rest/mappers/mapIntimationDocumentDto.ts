import type { IIntimationDocumentGeneratedSummary } from '../../../models/CrossManagement'
import type { ApiGenerateIntimationDocumentResponseDto } from '../dtos/ApiIntimationDocumentDtos'

function resolveStringValue(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim()) ?? null
}

function extractDocumentIdFromUrl(url: string | null | undefined) {
  if (!url) {
    return null
  }

  const match = url.match(/\/(?:api|bff)\/documentos\/([^/]+)\/descargar/i)

  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function mapGenerateIntimationDocumentResponseDto(
  response: ApiGenerateIntimationDocumentResponseDto
): IIntimationDocumentGeneratedSummary {
  if (typeof response === 'string' && response.trim()) {
    return {
      documentId: response,
      downloadUrl: ''
    }
  }

  if (typeof response !== 'object' || response === null) {
    throw new Error(
      'El backend no devolvió el identificador del documento generado.'
    )
  }

  const downloadUrl = resolveStringValue(
    response.urlDescarga,
    response.downloadUrl,
    response.url
  )
  const documentId = resolveStringValue(
    response.documentoId,
    response.documentId,
    response.id,
    extractDocumentIdFromUrl(downloadUrl)
  )

  if (!documentId) {
    throw new Error(
      'El backend no devolvió el identificador del documento generado.'
    )
  }

  return {
    documentId,
    downloadUrl: downloadUrl ?? ''
  }
}
