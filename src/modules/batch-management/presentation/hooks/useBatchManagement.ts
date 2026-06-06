'use client'

import type { IBatchListData } from '../../data/models/BatchManagement'
import { getBatchListCountLabel } from '../utils'
import {
  useBatchManagementBatches,
  useBatchManagementCreate,
  useBatchManagementCross,
  useBatchManagementSearch
} from './batch-management'

export function useBatchManagement(initialBatchData?: IBatchListData | null) {
  const batches = useBatchManagementBatches(initialBatchData)
  const search = useBatchManagementSearch({
    onBatchListDataChange: batches.applyBatchListData
  })
  const create = useBatchManagementCreate({
    onBatchCreated: batches.handleBatchCreated
  })
  const cross = useBatchManagementCross()

  return {
    navbarAction: {
      onOpenCreateModal: create.openCreateModal
    },
    searchBar: {
      searchValue: search.searchValue,
      isSearchPending: search.isSearchPending,
      resultCountLabel: getBatchListCountLabel(
        batches.batches.length,
        batches.totalBatches
      ),
      onSearchValueChange: search.updateSearchValue
    },
    table: {
      batches: batches.batches,
      expandedBatchId: batches.expandedBatchId,
      onToggleBatch: batches.toggleExpandedBatch,
      ...cross
    },
    createModal: {
      opened: create.isCreateModalOpen,
      name: create.createForm.name,
      regime: create.createForm.regime,
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
