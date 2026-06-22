export const DOCUMENTS_DATA_SOURCE_ENV = {
  apiBaseUrl: 'NEXT_PUBLIC_API_BASE_URL',
  documentsApiBaseUrl: 'DOCUMENTS_API_BASE_URL',
  useMock: 'NEXT_PUBLIC_USE_MOCK_DOCUMENTS'
} as const;

export function resolveDocumentsApiBaseUrl() {
  const documentsApiBaseUrl =
    process.env[DOCUMENTS_DATA_SOURCE_ENV.documentsApiBaseUrl]?.trim();

  if (documentsApiBaseUrl) {
    return documentsApiBaseUrl;
  }

  return process.env[DOCUMENTS_DATA_SOURCE_ENV.apiBaseUrl]?.trim();
}

export const DOCUMENTS_AUTH_ERROR = {
  code: 'documentos.autenticacion_requerida',
  message: 'No hay una sesion activa para operar con documentos.',
  status: 401
} as const;
