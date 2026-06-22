import { useMemo, useState } from 'react'
import type { IBatchManagementItem } from '../../../../data/models/BatchManagement'
import {
  BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE,
  BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS
} from '../../../constants'
import {
  getBatchDetailCuitPage,
  getBatchDetailCuitRangeLabel
} from '../../../utils'

export function useBatchManagementBatchDetail(batch: IBatchManagementItem) {
  const [pagination, setPagination] = useState({
    batchId: batch.id,
    itemsPerPage: BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE,
    page: 1
  })
  const isCurrentBatch = pagination.batchId === batch.id
  const page = isCurrentBatch ? pagination.page : 1
  const itemsPerPage = isCurrentBatch
    ? pagination.itemsPerPage
    : BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE

  const cuitPage = useMemo(
    () =>
      getBatchDetailCuitPage({
        cuits: batch.cuits,
        page,
        itemsPerPage
      }),
    [batch.cuits, itemsPerPage, page]
  )

  return {
    ...cuitPage,
    itemsPerPage,
    rangeLabel: getBatchDetailCuitRangeLabel(
      cuitPage.firstItemNumber,
      cuitPage.lastItemNumber,
      cuitPage.totalItems
    ),
    shouldShowPaginationControls:
      cuitPage.totalItems > BATCH_MANAGEMENT_DETAIL_ITEMS_PER_PAGE_OPTIONS[0],
    onItemsPerPageChange: (nextItemsPerPage: number) => {
      setPagination({
        batchId: batch.id,
        itemsPerPage: nextItemsPerPage,
        page: 1
      })
    },
    onPageChange: (nextPage: number) => {
      setPagination((currentPagination) => ({
        batchId: batch.id,
        itemsPerPage:
          currentPagination.batchId === batch.id
            ? currentPagination.itemsPerPage
            : BATCH_MANAGEMENT_DETAIL_DEFAULT_ITEMS_PER_PAGE,
        page: nextPage
      }))
    }
  }
}
