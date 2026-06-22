import {
  INTIMATION_DOCUMENT_API_ENDPOINTS,
  INTIMATION_DOCUMENT_EXTENSIONS
} from '../../data/constants/intimationDocumentContracts'
import type { IIntimationDocumentFormat } from '../../data/models/CrossManagement'
import { INTIMATION_DOCUMENT_DOWNLOAD_ERRORS } from '../constants/intimationDocumentDownload'

interface DownloadIntimationDocumentParams {
  documentId: string
  format: IIntimationDocumentFormat
}

function buildDownloadFileName(
  documentId: string,
  format: IIntimationDocumentFormat
) {
  return `intimacion_${documentId}.${INTIMATION_DOCUMENT_EXTENSIONS[format]}`
}

async function resolveDownloadError(response: Response) {
  try {
    const errorData = (await response.json()) as {
      mensaje?: unknown
      error?: unknown
    }

    if (typeof errorData.mensaje === 'string') {
      return errorData.mensaje
    }

    if (typeof errorData.error === 'string') {
      return errorData.error
    }
  } catch {
    return INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.downloadFailed
  }

  return INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.downloadFailed
}

export async function downloadIntimationDocument({
  documentId,
  format
}: DownloadIntimationDocumentParams) {
  if (typeof documentId !== 'string' || !documentId.trim()) {
    console.error({
      action: 'downloadIntimationDocument.invalid_document_id',
      documentId,
      format
    })

    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed)
  }

  const endpoint = INTIMATION_DOCUMENT_API_ENDPOINTS.download(
    encodeURIComponent(documentId),
    format
  )

  console.info({
    action: 'downloadIntimationDocument.fetch',
    endpoint,
    documentId,
    format
  })

  const response = await fetch(
    endpoint
  )

  console.info({
    action: 'downloadIntimationDocument.response',
    endpoint,
    documentId,
    format,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get('content-type')
  })

  if (!response.ok) {
    const error = await resolveDownloadError(response)

    console.error({
      action: 'downloadIntimationDocument.error',
      endpoint,
      documentId,
      format,
      status: response.status,
      error
    })

    throw new Error(error)
  }

  const blob = await response.blob()
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  console.info({
    action: 'downloadIntimationDocument.success',
    documentId,
    format,
    blobSize: blob.size,
    blobType: blob.type
  })

  link.href = blobUrl
  link.download = buildDownloadFileName(documentId, format)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0)
}
