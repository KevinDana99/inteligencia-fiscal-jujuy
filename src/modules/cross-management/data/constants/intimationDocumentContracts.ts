import type { IIntimationDocumentFormat } from '../models/CrossManagement'

export const INTIMATION_DOCUMENT_FORMATS = {
  PDF: 'Pdf',
  DOCX: 'Docx'
} as const satisfies Record<string, IIntimationDocumentFormat>

export const INTIMATION_DOCUMENT_FORMAT_QUERY: Record<
  IIntimationDocumentFormat,
  string
> = {
  Pdf: 'pdf',
  Docx: 'docx'
}

export const INTIMATION_DOCUMENT_EXTENSIONS: Record<
  IIntimationDocumentFormat,
  string
> = {
  Pdf: 'pdf',
  Docx: 'docx'
}

export const INTIMATION_DOCUMENT_CONTENT_TYPES: Record<
  IIntimationDocumentFormat,
  string
> = {
  Pdf: 'application/pdf',
  Docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

export const INTIMATION_DOCUMENT_API_ENDPOINTS = {
  generate: '/api/documentos/intimacion/generar',
  download: (documentId: string, format: IIntimationDocumentFormat) =>
    `/api/documentos/${documentId}/descargar?formato=${INTIMATION_DOCUMENT_FORMAT_QUERY[format]}`
} as const
