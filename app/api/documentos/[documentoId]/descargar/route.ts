import { NextRequest, NextResponse } from 'next/server'
import {
  INTIMATION_DOCUMENT_API_ENDPOINTS,
  INTIMATION_DOCUMENT_CONTENT_TYPES,
  INTIMATION_DOCUMENT_EXTENSIONS,
  INTIMATION_DOCUMENT_FORMATS
} from '@/modules/cross-management/data/constants/intimationDocumentContracts'
import type { IIntimationDocumentFormat } from '@/modules/cross-management/data/models/CrossManagement'
import { fetchWithAuthRetry } from '@/lib/api-client'
import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config'
import { getServerAuthSession } from '@/lib/auth/get-server-session'

type DownloadRouteContext = {
  params: Promise<{ documentoId: string }>
}

function resolveDocumentFormat(
  value: string | null
): IIntimationDocumentFormat | null {
  const normalizedValue = value?.toLowerCase()

  if (normalizedValue === INTIMATION_DOCUMENT_FORMATS.PDF.toLowerCase()) {
    return INTIMATION_DOCUMENT_FORMATS.PDF
  }

  if (normalizedValue === INTIMATION_DOCUMENT_FORMATS.DOCX.toLowerCase()) {
    return INTIMATION_DOCUMENT_FORMATS.DOCX
  }

  return null
}

function buildDownloadHeaders(
  response: Response,
  documentId: string,
  format: IIntimationDocumentFormat
) {
  const headers = new Headers()
  const contentType =
    response.headers.get('content-type') ??
    INTIMATION_DOCUMENT_CONTENT_TYPES[format]
  const contentDisposition =
    response.headers.get('content-disposition') ??
    `attachment; filename="intimacion_${documentId}.${INTIMATION_DOCUMENT_EXTENSIONS[format]}"`

  headers.set('Content-Type', contentType)
  headers.set('Content-Disposition', contentDisposition)

  return headers
}

async function parseDownloadError(response: Response) {
  try {
    return await response.json()
  } catch {
    return {
      codigo: 'documentos.intimacion.descarga_fallida',
      mensaje: 'No fue posible descargar la intimación.',
      estado: response.status
    }
  }
}

function createMockDocumentResponse(
  documentId: string,
  format: IIntimationDocumentFormat
) {
  return new Response(`Documento de intimación mock ${documentId}`, {
    status: 200,
    headers: {
      'Content-Type': INTIMATION_DOCUMENT_CONTENT_TYPES[format],
      'Content-Disposition': `attachment; filename="intimacion_${documentId}.${INTIMATION_DOCUMENT_EXTENSIONS[format]}"`
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: DownloadRouteContext
) {
  const { documentoId } = await params
  const requestedFormat = request.nextUrl.searchParams.get('formato')
  const format = resolveDocumentFormat(requestedFormat)

  console.info({
    action: 'downloadIntimationDocumentRoute.request',
    documentId: documentoId,
    requestedFormat,
    resolvedFormat: format
  })

  if (!documentoId.trim() || documentoId === 'undefined') {
    console.warn({
      action: 'downloadIntimationDocumentRoute.invalid_document_id',
      documentId: documentoId
    })

    return NextResponse.json(
      {
        codigo: 'documentos.intimacion.identificador_invalido',
        mensaje: 'No se recibió un identificador válido para descargar la intimación.',
        estado: 400
      },
      { status: 400 }
    )
  }

  if (!format) {
    console.warn({
      action: 'downloadIntimationDocumentRoute.invalid_format',
      documentId: documentoId,
      requestedFormat
    })

    return NextResponse.json(
      {
        codigo: 'documentos.intimacion.formato_no_soportado',
        mensaje: 'El formato solicitado no está soportado.',
        estado: 400
      },
      { status: 400 }
    )
  }

  if (
    process.env.NEXT_PUBLIC_USE_MOCK_CROSS_MANAGEMENT === 'true' ||
    process.env.NEXT_PUBLIC_USE_MOCK_DOCUMENTS === 'true'
  ) {
    console.info({
      action: 'downloadIntimationDocumentRoute.mock_response',
      documentId: documentoId,
      format
    })

    return createMockDocumentResponse(documentoId, format)
  }

  const session = await getServerAuthSession()

  if (!session?.accessToken) {
    console.warn({
      action: 'downloadIntimationDocumentRoute.no_session',
      documentId: documentoId,
      format
    })

    return NextResponse.json(
      {
        codigo: 'documentos.intimacion.no_autenticado',
        mensaje: 'No hay una sesión válida para descargar la intimación.',
        estado: 401
      },
      { status: 401 }
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  const apiConfig = await createAuthenticatedApiClientConfig({ baseUrl })
  const endpoint = INTIMATION_DOCUMENT_API_ENDPOINTS.download(
    encodeURIComponent(documentoId),
    format
  )

  console.info({
    action: 'downloadIntimationDocumentRoute.backend_request',
    baseUrl,
    endpoint,
    documentId: documentoId,
    format
  })

  const response = await fetchWithAuthRetry(
    `${baseUrl}${endpoint}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    },
    apiConfig
  )

  if (!response.ok) {
    const errorData = await parseDownloadError(response)

    console.error({
      action: 'downloadIntimationDocumentRoute.backend_error',
      documentId: documentoId,
      format,
      status: response.status,
      error: errorData
    })

    return NextResponse.json(errorData, {
      status: response.status
    })
  }

  const body = await response.arrayBuffer()

  console.info({
    action: 'downloadIntimationDocumentRoute.success',
    documentId: documentoId,
    format,
    status: response.status,
    contentType: response.headers.get('content-type'),
    contentDispositionPresent: Boolean(
      response.headers.get('content-disposition')
    ),
    byteLength: body.byteLength
  })

  return new Response(body, {
    status: 200,
    headers: buildDownloadHeaders(response, documentoId, format)
  })
}
