import type {
  DocumentDownloadFormat,
  IGeneratedDocument,
  IGeneratedInformeDocuments,
  IGenerateInformeDocumentPayload,
  IGenerateInformeDocumentsPayload
} from '@/modules/documents';

const INFORME_DOCUMENT_API_ENDPOINTS = {
  generate: '/bff/documentos/informe/generar',
  download: (documentId: string, format: DocumentDownloadFormat) =>
    `/bff/documentos/${documentId}/descargar?formato=${format}`
} as const;

const INFORME_DOCUMENT_EXTENSIONS: Record<DocumentDownloadFormat, string> = {
  pdf: 'pdf',
  docx: 'docx'
};

const INFORME_DOCUMENT_ERRORS = {
  generationFailed: 'No fue posible generar el informe.',
  downloadFailed: 'No fue posible descargar el documento.',
  requestTimeout:
    'La operación tardó demasiado. Intentá nuevamente en unos instantes.'
} as const;

const INFORME_DOCUMENT_REQUEST_TIMEOUT_MS = 180000;

function createRequestTimeout() {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    INFORME_DOCUMENT_REQUEST_TIMEOUT_MS
  );

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId)
  };
}

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

function resolveFetchErrorMessage(error: unknown, fallbackMessage: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  ) {
    return INFORME_DOCUMENT_ERRORS.requestTimeout;
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return INFORME_DOCUMENT_ERRORS.requestTimeout;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
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
  const timeout = createRequestTimeout();
  let response: Response;

  try {
    response = await fetch(INFORME_DOCUMENT_API_ENDPOINTS.generate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: timeout.signal
    });
  } catch (error) {
    throw new Error(
      resolveFetchErrorMessage(error, INFORME_DOCUMENT_ERRORS.generationFailed)
    );
  } finally {
    timeout.clear();
  }

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
  // Keep the requests sequential so a refreshed auth cookie from the first
  // generation is available before the second request starts.
  const pdf = await generateInformeDocument({
    ...payload,
    formato: 'Pdf'
  });
  const docx = await generateInformeDocument({
    ...payload,
    formato: 'Docx'
  });

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
  const timeout = createRequestTimeout();
  let response: Response;

  try {
    response = await fetch(endpoint, {
      signal: timeout.signal
    });
  } catch (error) {
    throw new Error(
      resolveFetchErrorMessage(error, INFORME_DOCUMENT_ERRORS.downloadFailed)
    );
  } finally {
    timeout.clear();
  }

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
