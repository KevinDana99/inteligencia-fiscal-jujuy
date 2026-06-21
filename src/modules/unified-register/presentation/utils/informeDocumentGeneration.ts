import type {
  DocumentDownloadFormat,
  IGeneratedDocument,
  IGeneratedInformeDocuments,
  IGenerateInformeDocumentPayload,
  IGenerateInformeDocumentsPayload
} from '@/modules/documents';

const INFORME_DOCUMENT_API_ENDPOINTS = {
  generate: '/api/documentos/informe/generar',
  download: (documentId: string, format: DocumentDownloadFormat) =>
    `/api/documentos/${documentId}/descargar?formato=${format}`
} as const;

const INFORME_DOCUMENT_EXTENSIONS: Record<DocumentDownloadFormat, string> = {
  pdf: 'pdf',
  docx: 'docx'
};

const INFORME_DOCUMENT_ERRORS = {
  generationFailed: 'No fue posible generar el informe.',
  downloadFailed: 'No fue posible descargar el documento.'
} as const;

function resolveErrorMessage(errorData: unknown, fallbackMessage: string) {
  if (typeof errorData !== 'object' || errorData === null) {
    return fallbackMessage;
  }

  const maybeError = errorData as {
    error?: unknown;
    message?: unknown;
    mensaje?: unknown;
    title?: unknown;
    errors?: Record<string, string[]>;
  };

  if (typeof maybeError.mensaje === 'string' && maybeError.mensaje.trim()) {
    return maybeError.mensaje;
  }

  if (typeof maybeError.error === 'string' && maybeError.error.trim()) {
    return maybeError.error;
  }

  if (typeof maybeError.message === 'string' && maybeError.message.trim()) {
    return maybeError.message;
  }

  if (typeof maybeError.title === 'string' && maybeError.title.trim()) {
    return maybeError.title;
  }

  if (maybeError.errors) {
    const firstError = Object.values(maybeError.errors).flat()[0];

    if (firstError) {
      return firstError;
    }
  }

  return fallbackMessage;
}

async function parseResponseError(response: Response, fallbackMessage: string) {
  try {
    return resolveErrorMessage(await response.json(), fallbackMessage);
  } catch {
    return fallbackMessage;
  }
}

function buildDownloadFileName(
  documentId: string,
  format: DocumentDownloadFormat
) {
  return `informe_${documentId}.${INFORME_DOCUMENT_EXTENSIONS[format]}`;
}

async function generateInformeDocument(
  payload: IGenerateInformeDocumentPayload
): Promise<IGeneratedDocument> {
  const response = await fetch(INFORME_DOCUMENT_API_ENDPOINTS.generate, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(
      await parseResponseError(response, INFORME_DOCUMENT_ERRORS.generationFailed)
    );
  }

  const generatedDocument = (await response.json()) as IGeneratedDocument;

  if (!generatedDocument.documentoId) {
    throw new Error(INFORME_DOCUMENT_ERRORS.generationFailed);
  }

  return generatedDocument;
}

export async function generateInformeDocuments(
  payload: IGenerateInformeDocumentsPayload
): Promise<IGeneratedInformeDocuments> {
  const [pdf, docx] = await Promise.all([
    generateInformeDocument({
      ...payload,
      formato: 'Pdf'
    }),
    generateInformeDocument({
      ...payload,
      formato: 'Docx'
    })
  ]);

  return {
    pdf,
    docx
  };
}

export async function downloadInformeDocument({
  documentId,
  format
}: {
  documentId: string;
  format: DocumentDownloadFormat;
}) {
  if (typeof documentId !== 'string' || !documentId.trim()) {
    throw new Error(INFORME_DOCUMENT_ERRORS.generationFailed);
  }

  const endpoint = INFORME_DOCUMENT_API_ENDPOINTS.download(
    encodeURIComponent(documentId),
    format
  );
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      await parseResponseError(response, INFORME_DOCUMENT_ERRORS.downloadFailed)
    );
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = buildDownloadFileName(documentId, format);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}
