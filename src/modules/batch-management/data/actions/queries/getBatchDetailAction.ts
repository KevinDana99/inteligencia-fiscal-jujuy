'use server';

import { ApiClientError } from '@/lib/api-client';
import { createServerBatchManagementSource } from '../../data-access';
import type { IBatchManagementItem, IBatchQueryResult } from '../../models/BatchManagement';

export async function getBatchDetailAction(
  batchId: string
): Promise<IBatchQueryResult<IBatchManagementItem>> {
  try {
    const source = await createServerBatchManagementSource();
    const data = await source.getBatch(batchId);

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
      error: error instanceof Error ? error.message : 'Unable to get batch detail'
    };
  }
}
