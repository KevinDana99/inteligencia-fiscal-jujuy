import type {
  IReprocessingItems,
  IReprocessingListData
} from '../../data/models/Reprocessing'

export function getInitialReprocessingItems(
  initialData?: IReprocessingListData | null
): IReprocessingItems {
  return initialData?.items ?? []
}
