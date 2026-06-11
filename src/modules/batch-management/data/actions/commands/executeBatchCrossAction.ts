'use server';

import { ApiClientError } from '@/lib/api-client';
import { createServerBatchManagementSource } from '../../data-access';
import type {
  IBatchCommandResult,
  IBatchCrossExecutionPayload,
  IBatchCrossExecutionSummary
} from '../../models/BatchManagement';

export async function executeBatchCrossAction(
  payload: IBatchCrossExecutionPayload
): Promise<IBatchCommandResult<IBatchCrossExecutionSummary>> {
  try {
    const source = await createServerBatchManagementSource();
    const data = await source.executeBatchCross(payload);

    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiData = error.data as { codigo?: string; mensaje?: string; estado?: number } | undefined;

      return {
        success: false,
        data: null,
        error: apiData?.mensaje ?? error.message,
        code: apiData?.codigo,
        status: apiData?.estado ?? error.status
      };
    }

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unable to execute batch cross'
    };
  }
}
