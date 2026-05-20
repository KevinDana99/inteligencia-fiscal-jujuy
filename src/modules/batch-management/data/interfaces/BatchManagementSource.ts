import type {
  IBatchCreatePayload,
  IBatchCreatedSummary,
  IBatchListData,
  IBatchListParams,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewPayload
} from '../models/BatchManagement';

export interface IBatchManagementQueryPort {
  listBatches(params?: IBatchListParams): Promise<IBatchListData>;
  getBatch(batchId: string): Promise<IBatchManagementItem>;
}

export interface IBatchManagementCommandPort {
  previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData>;
  createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary>;
}

export interface IBatchManagementSource
  extends IBatchManagementQueryPort,
    IBatchManagementCommandPort {}
