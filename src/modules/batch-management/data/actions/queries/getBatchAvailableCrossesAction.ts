'use server';

import { ApiClientError } from '@/lib/api-client';
import { createServerBatchManagementSource } from '../../data-access';
import type {
  IBatchAvailableCrosses,
  IBatchQueryResult
} from '../../models/BatchManagement';

export async function getBatchAvailableCrossesAction(): Promise<
  IBatchQueryResult<IBatchAvailableCrosses>
> {
  try {
    const source = await createServerBatchManagementSource();
    const data = await source.listAvailableCrosses();

    return { data };
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiData = error.data as { codigo?: string; mensaje?: string; estado?: number } | undefined;

      return {
        data: null,
        error: apiData?.mensaje ?? error.message,
        code: apiData?.codigo,
        status: apiData?.estado ?? error.status
      };
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unable to list available crosses'
    };
  }
}
