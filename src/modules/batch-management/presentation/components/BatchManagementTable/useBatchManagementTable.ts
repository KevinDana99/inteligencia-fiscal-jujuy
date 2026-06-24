'use client'

import type { BatchManagementTableController } from '../../hooks/useBatchManagement'

export function useBatchManagementTable(controller: BatchManagementTableController) {
  return {
    isEmpty: !controller.batches.length && !controller.isPending,
    isPending: controller.isPending,
    skeletonRowCount: controller.pendingItemsPerPage ?? controller.itemsPerPage,
    rows: controller.batches.map((batch) => ({
      id: batch.id,
      batch,
      isExpanded: controller.expandedBatchId === batch.id,
      isLoading: controller.loadingBatchId === batch.id,
      loadingCuitItemsPerPage:
        controller.loadingBatchId === batch.id
          ? controller.loadingBatchCuitItemsPerPage ?? batch.cuitItemsPerPage
          : batch.cuitItemsPerPage,
      onToggle: () => controller.onToggleBatch(batch.id),
      onCuitPageChange: (page: number, itemsPerPage: number) =>
        controller.onBatchCuitPageChange(batch.id, { page, itemsPerPage }),
      crossMenu: {
        batchId: batch.id,
        availableCrosses: controller.availableCrosses,
        filters: controller.getBatchCrossFilters(batch.id),
        validationMessage: controller.getBatchCrossValidationMessage(batch.id),
        executionError: controller.getBatchCrossExecutionError(batch.id),
        canConfirm: controller.canConfirmBatchCrossFilters(batch.id),
        isExecuting: controller.isBatchCrossExecutionPending(batch.id),
        onSectionToggle: controller.toggleBatchCrossSection,
        onYearChange: controller.setBatchCrossYear,
        onMonthChange: controller.setBatchCrossMonth,
        onCrossTypeToggle: controller.toggleBatchCrossType,
        onConfirm: controller.confirmBatchCrossFilters
      }
    }))
  }
}
