import type {
  IBatchAvailableCrosses,
  IBatchCrossExecutionPayload,
  IBatchCrossExecutionSummary,
  IBatchCreatePayload,
  IBatchCreatedSummary,
  IBatchListData,
  IBatchListParams,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewPayload
} from '../models/BatchManagement';

export interface IBatchManagementQueryPort {
  listAvailableCrosses(): Promise<IBatchAvailableCrosses>;
  listBatches(params?: IBatchListParams): Promise<IBatchListData>;
  getBatch(batchId: string): Promise<IBatchManagementItem>;
}

export interface IBatchManagementCommandPort {
  previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData>;
  createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary>;
  executeBatchCross(
    payload: IBatchCrossExecutionPayload
  ): Promise<IBatchCrossExecutionSummary>;
}

export interface IBatchManagementSource
  extends IBatchManagementQueryPort,
    IBatchManagementCommandPort {}
