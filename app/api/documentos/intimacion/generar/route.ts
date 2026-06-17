import { NextRequest, NextResponse } from 'next/server'
import { INTIMATION_DOCUMENT_API_ENDPOINTS } from '@/modules/cross-management/data/constants/intimationDocumentContracts'
import type {
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '@/modules/cross-management/data/models/CrossManagement'
import type {
  ApiGenerateIntimationDocumentRequestDto,
  ApiGenerateIntimationDocumentResponseDto
} from '@/modules/cross-management/data/sources/rest/dtos/ApiIntimationDocumentDtos'
import { mapGenerateIntimationDocumentResponseDto } from '@/modules/cross-management/data/sources/rest/mappers/mapIntimationDocumentDto'
import { normalizeIntimationDocumentPayload } from '@/modules/cross-management/data/utils/normalizeIntimationDocumentPayload'
import { fetchWithAuthRetry } from '@/lib/api-client'
import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config'
import { getServerAuthSession } from '@/lib/auth/get-server-session'

function createGenerationErrorResponse(
  status: number,
  code: string,
  message: string
) {
  return NextResponse.json(
    {
      codigo: code,
      mensaje: message,
      estado: status
    },
    { status }
  )
}

async function parseGenerateRequestBody(request: NextRequest) {
  try {
    return (await request.json()) as IGenerateIntimationDocumentPayload
  } catch {
    return null
  }
}

async function parseGenerateBackendError(response: Response) {
  const responseText = await response.text()

  if (!responseText.trim()) {
    return {
      codigo: 'documentos.intimacion.generacion_fallida',
      mensaje: 'No fue posible generar la intimación.',
      estado: response.status
    }
  }

  try {
    return JSON.parse(responseText) as unknown
  } catch {
    return {
      codigo: 'documentos.intimacion.generacion_fallida',
      mensaje: responseText,
      estado: response.status
    }
  }
}

async function parseGenerateBackendResponse(
  response: Response
): Promise<ApiGenerateIntimationDocumentResponseDto> {
  const responseText = await response.text()

  if (!responseText.trim()) {
    throw new Error(
      'El backend no devolvió el identificador del documento generado.'
    )
  }

  try {
    return JSON.parse(responseText) as ApiGenerateIntimationDocumentResponseDto
  } catch {
    return responseText
  }
}

function createMockGenerationResponse(
  payload: IGenerateIntimationDocumentPayload
): IIntimationDocumentGeneratedSummary {
  const documentId = `mock-${payload.contribuyente.id}-${payload.formato.toLowerCase()}`

  return {
    documentId,
    downloadUrl: INTIMATION_DOCUMENT_API_ENDPOINTS.download(
      encodeURIComponent(documentId),
      payload.formato
    )
  }
}

export async function POST(request: NextRequest) {
  const payload = await parseGenerateRequestBody(request)

  if (!payload) {
    return createGenerationErrorResponse(
      400,
      'documentos.intimacion.request_invalida',
      'No se recibió un cuerpo válido para generar la intimación.'
    )
  }

  const normalizedPayload: ApiGenerateIntimationDocumentRequestDto =
    normalizeIntimationDocumentPayload(payload)

  console.info({
    action: 'generateIntimationDocumentRoute.request',
    format: normalizedPayload.formato,
    hasContributorId: Boolean(normalizedPayload.contribuyente.id),
    rowsCount: normalizedPayload.filasPlanilla.length,
    selectedColumnsCount: normalizedPayload.columnasSeleccionadas.length
  })

  if (process.env.NEXT_PUBLIC_USE_MOCK_CROSS_MANAGEMENT === 'true') {
    const mockResponse = createMockGenerationResponse(normalizedPayload)

    console.info({
      action: 'generateIntimationDocumentRoute.mock_response',
      documentId: mockResponse.documentId,
      hasDownloadUrl: Boolean(mockResponse.downloadUrl)
    })

    return NextResponse.json(mockResponse, { status: 201 })
  }

  const session = await getServerAuthSession()

  if (!session?.accessToken) {
    console.warn({
      action: 'generateIntimationDocumentRoute.no_session',
      format: normalizedPayload.formato
    })

    return createGenerationErrorResponse(
      401,
      'documentos.intimacion.no_autenticado',
      'No hay una sesión válida para generar la intimación.'
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (!baseUrl) {
    console.error({
      action: 'generateIntimationDocumentRoute.missing_base_url'
    })

    return createGenerationErrorResponse(
      500,
      'documentos.intimacion.backend_no_configurado',
      'No está configurada la URL base del backend.'
    )
  }

  const apiConfig = await createAuthenticatedApiClientConfig({ baseUrl })

  console.info({
    action: 'generateIntimationDocumentRoute.backend_request',
    baseUrl,
    endpoint: INTIMATION_DOCUMENT_API_ENDPOINTS.generate,
    format: normalizedPayload.formato,
    rowsCount: normalizedPayload.filasPlanilla.length,
    selectedColumnsCount: normalizedPayload.columnasSeleccionadas.length
  })

  try {
    const response = await fetchWithAuthRetry(
      `${baseUrl}${INTIMATION_DOCUMENT_API_ENDPOINTS.generate}`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(normalizedPayload)
      },
      apiConfig
    )

    if (!response.ok) {
      const errorData = await parseGenerateBackendError(response)

      console.error({
        action: 'generateIntimationDocumentRoute.backend_error',
        status: response.status,
        error: errorData
      })

      return NextResponse.json(errorData, { status: response.status })
    }

    const backendResponse = await parseGenerateBackendResponse(response)
    const mappedResponse =
      mapGenerateIntimationDocumentResponseDto(backendResponse)

    console.info({
      action: 'generateIntimationDocumentRoute.success',
      status: response.status,
      documentId: mappedResponse.documentId,
      hasDownloadUrl: Boolean(mappedResponse.downloadUrl)
    })

    return NextResponse.json(mappedResponse, {
      status: response.status === 201 ? 201 : 200
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible generar la intimación.'

    console.error({
      action: 'generateIntimationDocumentRoute.error',
      error: message
    })

    return createGenerationErrorResponse(
      500,
      'documentos.intimacion.generacion_fallida',
      message
    )
  }
}
