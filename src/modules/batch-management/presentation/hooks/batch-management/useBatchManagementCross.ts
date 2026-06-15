'use client'

import type {
  IBatchAvailableCrosses,
  IBatchCrossFilters,
  IBatchCrossSectionFilters
} from '../../../data/models/BatchManagement'
import { useBatchManagementCrossExecution } from './useBatchManagementCrossExecution'
import { useBatchManagementCrossFilters } from './useBatchManagementCrossFilters'

export function useBatchManagementCross(
  availableCrosses: IBatchAvailableCrosses = []
) {
  const filters = useBatchManagementCrossFilters()
  const execution = useBatchManagementCrossExecution({
    getBatchCrossFilters: filters.getBatchCrossFilters,
    availableCrosses
  })

  function setBatchCrossYear(
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) {
    execution.clearBatchCrossExecutionError(batchId)
    filters.setBatchCrossYear(batchId, section, field, value)
  }

  function setBatchCrossMonth(
    batchId: string,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromMonth' | 'toMonth'>,
    value: string | null
  ) {
    execution.clearBatchCrossExecutionError(batchId)
    filters.setBatchCrossMonth(batchId, field, value)
  }

  function toggleBatchCrossSection(
    batchId: string,
    section: keyof IBatchCrossFilters
  ) {
    execution.clearBatchCrossExecutionError(batchId)
    filters.toggleBatchCrossSection(batchId, section)
  }

  function toggleBatchCrossType(
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) {
    execution.clearBatchCrossExecutionError(batchId)
    filters.toggleBatchCrossType(batchId, section, crossType)
  }

  return {
    availableCrosses,
    getBatchCrossFilters: filters.getBatchCrossFilters,
    getBatchCrossValidationMessage: execution.getBatchCrossValidation,
    getBatchCrossExecutionError: execution.getBatchCrossExecutionError,
    isBatchCrossExecutionPending: execution.isBatchCrossExecutionPending,
    canConfirmBatchCrossFilters: execution.canConfirmBatchCrossFilters,
    toggleBatchCrossSection,
    setBatchCrossYear,
    setBatchCrossMonth,
    toggleBatchCrossType,
    confirmBatchCrossFilters: execution.confirmBatchCrossFilters
  }
}
