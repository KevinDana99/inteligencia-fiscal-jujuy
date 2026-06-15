'use server';

import { ApiClientError } from '@/lib/api-client';
import { createServerBatchManagementSource } from '../../data-access';
import type {
  IBatchAddContributorPayload,
  IBatchCommandResult
} from '../../models/BatchManagement';

export async function addContributorToBatchAction(
  payload: IBatchAddContributorPayload
): Promise<IBatchCommandResult<null>> {
  try {
    const source = await createServerBatchManagementSource();

    await source.addContributorToBatch(payload);

    return { success: true, data: null };
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiData = error.data as
        | { codigo?: string; mensaje?: string; estado?: number }
        | undefined;

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
      error:
        error instanceof Error
          ? error.message
          : 'Unable to add contributor to batch'
    };
  }
}
