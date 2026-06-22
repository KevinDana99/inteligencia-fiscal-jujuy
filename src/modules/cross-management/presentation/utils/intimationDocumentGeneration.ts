import { INTIMATION_DOCUMENT_API_ENDPOINTS } from '../../data/constants/intimationDocumentContracts'
import type {
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '../../data/models/CrossManagement'
import type { ApiGenerateIntimationDocumentResponseDto } from '../../data/sources/rest/dtos/ApiIntimationDocumentDtos'
import { mapGenerateIntimationDocumentResponseDto } from '../../data/sources/rest/mappers/mapIntimationDocumentDto'
import { normalizeIntimationDocumentPayload } from '../../data/utils/normalizeIntimationDocumentPayload'
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

async function parseGenerateResponse(
  response: Response
): Promise<ApiGenerateIntimationDocumentResponseDto> {
  const responseText = await response.text()

  if (!responseText.trim()) {
    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed)
  }

  try {
    return JSON.parse(responseText) as ApiGenerateIntimationDocumentResponseDto
  } catch {
    return responseText
  }
}

export async function generateIntimationDocument(
  payload: IGenerateIntimationDocumentPayload
): Promise<IIntimationDocumentGeneratedSummary> {
  const normalizedPayload = normalizeIntimationDocumentPayload(payload)
  const response = await fetch(INTIMATION_DOCUMENT_API_ENDPOINTS.generate, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizedPayload)
  })

  if (!response.ok) {
    throw new Error(await parseGenerateError(response))
  }

  const generatedDocument = mapGenerateIntimationDocumentResponseDto(
    await parseGenerateResponse(response)
  )

  if (!generatedDocument.documentId) {
    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.generationFailed)
  }

  return generatedDocument
}
