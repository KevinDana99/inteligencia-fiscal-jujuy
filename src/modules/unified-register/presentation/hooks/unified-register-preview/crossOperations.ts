import type { IBatchCrossExecutionPayload } from '@/modules/batch-management/data/models/BatchManagement';
import { executeCrossAction } from '@/modules/cross-management/data/actions';

export async function executePreviewCrossPayloads(
  contributorId: string,
  payloads: IBatchCrossExecutionPayload[]
) {
  return Promise.all(
    payloads.map((payload) =>
      executeCrossAction({
        crossCode: payload.crossCode,
        crossVersion: payload.crossVersion,
        originType: 'individual',
        batchId: null,
        contributorId,
        periodFrom: payload.periodFrom,
        periodTo: payload.periodTo,
        parameters: payload.parameters ?? {}
      })
    )
  );
}
