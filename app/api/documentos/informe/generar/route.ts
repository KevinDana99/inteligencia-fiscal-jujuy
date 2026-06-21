import { NextRequest, NextResponse } from 'next/server'
import { createServerDocumentsSource } from '@/modules/documents/data/data-access'
import { resolveDocumentsActionError } from '@/modules/documents/data/actions/shared/resolveDocumentsActionError'
import type {
  IGenerateInformeDocumentPayload,
  InformeDocumentGenerationFormat
} from '@/modules/documents'

const INFORME_GENERATION_FORMATS = new Set<InformeDocumentGenerationFormat>([
  'Pdf',
  'Docx'
])

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
    return (await request.json()) as unknown
  } catch {
    return null
  }
}

function isInformeGenerationFormat(
  value: unknown
): value is InformeDocumentGenerationFormat {
  return (
    typeof value === 'string' &&
    INFORME_GENERATION_FORMATS.has(value as InformeDocumentGenerationFormat)
  )
}

function isInformeGenerationPayload(
  payload: unknown
): payload is IGenerateInformeDocumentPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false
  }

  const maybePayload = payload as Partial<IGenerateInformeDocumentPayload>

  return (
    typeof maybePayload.contribuyenteId === 'string' &&
    maybePayload.contribuyenteId.trim().length > 0 &&
    isInformeGenerationFormat(maybePayload.formato)
  )
}

export async function POST(request: NextRequest) {
  const payload = await parseGenerateRequestBody(request)

  if (!isInformeGenerationPayload(payload)) {
    return createGenerationErrorResponse(
      400,
      'documentos.informe.request_invalida',
      'No se recibió un cuerpo válido para generar el informe.'
    )
  }

  console.info({
    action: 'generateInformeDocumentRoute.request',
    format: payload.formato,
    hasContributorId: Boolean(payload.contribuyenteId),
    selectedCrossesCount: payload.crucesSeleccionados?.length ?? 0
  })

  try {
    const source = await createServerDocumentsSource()
    const generatedDocument = await source.generateInformeDocument(payload)

    console.info({
      action: 'generateInformeDocumentRoute.success',
      format: payload.formato,
      documentId: generatedDocument.documentoId,
      hasDownloadUrl: Boolean(generatedDocument.urlDescarga)
    })

    return NextResponse.json(generatedDocument, { status: 201 })
  } catch (error) {
    const resolvedError = resolveDocumentsActionError(
      error,
      'No fue posible generar el informe.'
    )
    const status = resolvedError.status ?? 500

    console.error({
      action: 'generateInformeDocumentRoute.error',
      format: payload.formato,
      status,
      code: resolvedError.code,
      error: resolvedError.error
    })

    return createGenerationErrorResponse(
      status,
      resolvedError.code ?? 'documentos.informe.generacion_fallida',
      resolvedError.error
    )
  }
}
