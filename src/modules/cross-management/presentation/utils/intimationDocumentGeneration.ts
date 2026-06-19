import { INTIMATION_DOCUMENT_API_ENDPOINTS } from '../../data/constants/intimationDocumentContracts'
import type {
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '../../data/models/CrossManagement'
import { INTIMATION_DOCUMENT_DOWNLOAD_ERRORS } from '../constants/intimationDocumentDownload'

function resolveGenerateErrorMessage(errorData: unknown) {
  if (typeof errorData !== 'object' || errorData === null) {
    return INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed
  }

  const maybeError = errorData as {
    error?: unknown
    message?: unknown
    mensaje?: unknown
    title?: unknown
  }

  if (typeof maybeError.mensaje === 'string' && maybeError.mensaje.trim()) {
    return maybeError.mensaje
  }

  if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
    return maybeError.error
  }

  if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
    return maybeError.message
  }

  if (typeof maybeError.title === 'string' && maybeError.title.trim()) {
    return maybeError.title
  }

  return INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed
}

async function parseGenerateError(response: Response) {
  try {
    return resolveGenerateErrorMessage(await response.json())
  } catch {
    return INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed
  }
}

export async function generateIntimationDocument(
  payload: IGenerateIntimationDocumentPayload
): Promise<IIntimationDocumentGeneratedSummary> {
  const response = await fetch(INTIMATION_DOCUMENT_API_ENDPOINTS.generate, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(await parseGenerateError(response))
  }

  const generatedDocument =
    (await response.json()) as IIntimationDocumentGeneratedSummary

  if (!generatedDocument.documentId) {
    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed)
  }

  return generatedDocument
}
