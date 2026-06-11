import { ApiClientError } from '@/lib/api-client';
import type { IExplorerRegisterQueryResult } from '../models/ExplorerRegister';

export function mapExplorerRegisterActionError<TData>(
  error: unknown,
  fallbackMessage: string
): IExplorerRegisterQueryResult<TData> {
  if (error instanceof ApiClientError) {
    const apiData = error.data as
      | { codigo?: string; mensaje?: string; estado?: number }
      | undefined;

    return {
      data: null,
      error: apiData?.mensaje ?? error.message,
      code: apiData?.codigo,
      status: apiData?.estado ?? error.status
    };
  }

  return {
    data: null,
    error: error instanceof Error ? error.message : fallbackMessage
  };
}
