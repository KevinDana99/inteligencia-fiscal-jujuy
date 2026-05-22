'use server';

import { createServerBatchManagementSource } from '../../data-access';
import type { IBatchListData, IBatchListParams, IBatchQueryResult } from '../../models/BatchManagement';
import { ApiClientError } from '@/lib/api-client';

export async function getBatchManagementAction(
  params: IBatchListParams = {}
): Promise<IBatchQueryResult<IBatchListData>> {
  try {
    const source = await createServerBatchManagementSource();
    const data = await source.listBatches(params);

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
      error: error instanceof Error ? error.message : 'Unable to list batches'
    };
  }
}
