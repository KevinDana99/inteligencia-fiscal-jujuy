import { ApiClientError } from '@/lib/api-client';

type ActionErrorState = {
  error: string;
  code?: string;
  status?: number;
};

export function resolveDocumentsActionError(
  error: unknown,
  fallbackMessage: string
): ActionErrorState {
  if (error instanceof ApiClientError) {
    const errorData =
      typeof error.data === 'object' && error.data !== null
        ? (error.data as {
            codigo?: unknown;
            mensaje?: unknown;
            estado?: unknown;
            status?: unknown;
          })
        : null;

    return {
      error:
        typeof errorData?.mensaje === 'string'
          ? errorData.mensaje
          : error.message || fallbackMessage,
      code: typeof errorData?.codigo === 'string' ? errorData.codigo : undefined,
      status:
        typeof errorData?.estado === 'number'
          ? errorData.estado
          : typeof errorData?.status === 'number'
            ? errorData.status
            : error.status
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message || fallbackMessage
    };
  }

  return {
    error: fallbackMessage
  };
}
