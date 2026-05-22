import type {
  IReprocessingListData,
  IReprocessingListParams,
  IReprocessingMarkedSummary,
  IReprocessingMarkPayload
} from '../models/Reprocessing'

export interface IReprocessingSource {
  listReprocessing(params?: IReprocessingListParams): Promise<IReprocessingListData>
  markReprocessing(
    payload: IReprocessingMarkPayload
  ): Promise<IReprocessingMarkedSummary>
  unmarkReprocessing(contribuyenteId: string): Promise<void>
}
