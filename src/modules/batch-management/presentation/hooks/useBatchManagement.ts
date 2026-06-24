'use client'

import type {
  IBatchAvailableCrosses,
  IBatchListData
} from '../../data/models/BatchManagement'
import { getBatchListCountLabel, getBatchListRangeLabel } from '../utils'
import {
  useBatchManagementBatches,
  useBatchManagementCreate,
  useBatchManagementCross,
  useBatchManagementSearch
} from './batch-management'

export function useBatchManagement(
  initialBatchData?: IBatchListData | null,
  initialAvailableCrosses: IBatchAvailableCrosses = []
) {
  const batches = useBatchManagementBatches(initialBatchData)
  const search = useBatchManagementSearch({
    itemsPerPage: batches.itemsPerPage,
    onBatchListDataChange: batches.applyBatchListData
  })
  const create = useBatchManagementCreate({
    onBatchCreated: batches.handleBatchCreated
  })
  const cross = useBatchManagementCross(initialAvailableCrosses)

  return {
    navbarAction: {
      onOpenCreateModal: () => create.openCreateModal()
    },
    searchBar: {
      searchValue: search.searchValue,
      isSearchPending: search.isSearchPending,
      resultCountLabel: getBatchListCountLabel(
        batches.batches.length,
        batches.totalBatches
      ),
      onSearchValueChange: search.updateSearchValue,
      onSearchSubmit: search.submitSearchValue
    },
    table: {
      batches: batches.batches,
      page: search.pendingPage ?? batches.page,
      itemsPerPage: search.pendingItemsPerPage ?? batches.itemsPerPage,
      pendingItemsPerPage: search.pendingItemsPerPage,
      totalBatches: batches.totalBatches,
      totalPages: batches.totalPages,
      isPending: search.isSearchPending,
      rangeLabel: getBatchListRangeLabel(
        batches.page,
        batches.itemsPerPage,
        batches.batches.length,
        batches.totalBatches
      ),
      expandedBatchId: batches.expandedBatchId,
      loadingBatchId: batches.loadingBatchId,
      loadingBatchCuitItemsPerPage: batches.loadingBatchCuitItemsPerPage,
      onToggleBatch: batches.toggleExpandedBatch,
      onBatchCuitPageChange: batches.changeBatchCuitPage,
      onPageChange: search.changePage,
      onItemsPerPageChange: search.changeItemsPerPage,
      ...cross
    },
    createModal: {
      opened: create.isCreateModalOpen,
      name: create.createForm.name,
      regime: create.createForm.regime,
      isRegimeLocked: create.isRegimeLocked,
      regimeOptions: create.regimeOptions,
      description: create.createForm.description,
      loadedCuitsSearchValue: create.loadedCuitsSearchValue,
      loadedCuitsCount: create.loadedCuits.length,
      filteredLoadedCuits: create.filteredLoadedCuits,
      previewData: create.previewData,
      previewError: create.previewError,
      createError: create.createError,
      isImportPreviewOpen: create.isImportPreviewOpen,
      isPreviewPending: create.isPreviewPending,
      isCreatePending: create.isCreatePending,
      onClose: create.closeCreateModal,
      onFieldChange: create.setCreateFormField,
      onManualCuitsAdd: create.addManualCuits,
      onLoadedCuitRemove: create.removeLoadedCuit,
      onLoadedCuitsSearchChange: create.setLoadedCuitsSearchValue,
      onImportFileSelect: create.openImportPreview,
      onImportPreviewClose: create.closeImportPreview,
      onImportPreviewConfirm: create.confirmImportPreview,
      onSubmit: create.createBatch
    }
  }
}

export type BatchManagementPageController = ReturnType<typeof useBatchManagement>
export type BatchManagementTableController = BatchManagementPageController['table']
export type BatchManagementCreateModalController =
  BatchManagementPageController['createModal']
