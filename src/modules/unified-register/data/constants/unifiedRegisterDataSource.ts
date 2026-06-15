export const UNIFIED_REGISTER_DATA_SOURCE_ENV = {
  apiBaseUrl: 'NEXT_PUBLIC_API_BASE_URL',
  useMock: 'NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER'
} as const;

export const UNIFIED_REGISTER_AUTH_ERROR = {
  code: 'unified_register.auth.missing_session',
  message: 'No hay una sesión autenticada para consultar el padrón unificado.',
  status: 401
} as const;
