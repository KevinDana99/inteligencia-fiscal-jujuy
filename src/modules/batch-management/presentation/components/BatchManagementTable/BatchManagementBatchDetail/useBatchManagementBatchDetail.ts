import type { IBatchManagementItem } from '../../../../data/models/BatchManagement'
import {
  BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE,
  BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS
} from '../../../constants'
import {
  getBatchDetailCuitRange,
  getBatchDetailCuitRangeLabel
} from '../../../utils'

type UseBatchManagementBatchDetailParams = {
  batch: IBatchManagementItem
  onCuitPageChange: (page: number, itemsPerPage: number) => void
}

export function useBatchManagementBatchDetail({
  batch,
  onCuitPageChange
}: UseBatchManagementBatchDetailParams) {
  const page = batch.cuitPage || 1
  const itemsPerPage =
    batch.cuitItemsPerPage || BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE
  const totalItems = batch.cuitTotalItems
  const totalPages =
    batch.cuitTotalPages ||
    (totalItems ? Math.ceil(totalItems / Math.max(1, itemsPerPage)) : 0)
  const cuitRange = getBatchDetailCuitRange({
    page,
    itemsPerPage,
    visibleItems: batch.cuits.length,
    totalItems
  })

  return {
    ...cuitRange,
    cuits: batch.cuits,
    page,
    itemsPerPage,
    totalPages,
    rangeLabel: getBatchDetailCuitRangeLabel(
      cuitRange.firstItemNumber,
      cuitRange.lastItemNumber,
      cuitRange.totalItems
    ),
    shouldShowPaginationControls:
      totalItems > BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS[0],
    onItemsPerPageChange: (nextItemsPerPage: number) => {
      onCuitPageChange(1, nextItemsPerPage)
    },
    onPageChange: (nextPage: number) => {
      onCuitPageChange(nextPage, itemsPerPage)
    }
  }
}
