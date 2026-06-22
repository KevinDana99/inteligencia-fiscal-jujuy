import type {
  IBatchDetailParams,
  IBatchListParams
} from '../data/models/BatchManagement'

export const DEFAULT_BATCH_MANAGEMENT_LIST_QUERY: IBatchListParams = {
  page: 1,
  itemsPerPage: 10
}

export const DEFAULT_BATCH_DETAIL_QUERY: Required<IBatchDetailParams> = {
  page: 1,
  itemsPerPage: 10
}
