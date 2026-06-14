import type { DocumentDownloadFormat } from '../../../models/Documents';

export const DOCUMENT_API_ROUTES = {
  informeGenerate: '/api/documentos/informe/generar',
  download: (documentoId: string, formato: DocumentDownloadFormat) =>
    `/api/documentos/${documentoId}/descargar?formato=${formato}`
} as const;
