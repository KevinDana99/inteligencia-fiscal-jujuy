'use client'

import { useState } from 'react'
import { executeBatchCrossAction } from '../../../data/actions'
import type { IBatchCrossFilters } from '../../../data/models/BatchManagement'
import {
  buildBatchCrossExecutionPayloads,
  getBatchCrossValidationMessage,
  getEmptyExecutableBatchCrossMessage,
  hasExecutableBatchCrosses
} from '../../utils'

type UseBatchManagementCrossExecutionParams = {
  getBatchCrossFilters: (batchId: string) => IBatchCrossFilters
}

export function useBatchManagementCrossExecution({
  getBatchCrossFilters
}: UseBatchManagementCrossExecutionParams) {
  const [batchCrossExecutionErrors, setBatchCrossExecutionErrors] = useState<
    Record<string, string | null>
  >({})
  const [executingBatchCrossIds, setExecutingBatchCrossIds] = useState<
    Record<string, boolean>
  >({})

  function getBatchCrossValidation(batchId: string) {
    return getBatchCrossValidationMessage(getBatchCrossFilters(batchId))
  }

  function getBatchCrossExecutionError(batchId: string) {
    return batchCrossExecutionErrors[batchId] ?? null
  }

  function isBatchCrossExecutionPending(batchId: string) {
    return executingBatchCrossIds[batchId] ?? false
  }

  function setBatchCrossExecutionError(batchId: string, message: string | null) {
    setBatchCrossExecutionErrors((current) => ({
      ...current,
      [batchId]: message
    }))
  }

  function clearBatchCrossExecutionError(batchId: string) {
    setBatchCrossExecutionError(batchId, null)
  }

  function canConfirmBatchCrossFilters(batchId: string) {
    const filters = getBatchCrossFilters(batchId)

    if (!hasExecutableBatchCrosses(batchId, filters)) {
      return false
    }

    return !getBatchCrossValidation(batchId) && !isBatchCrossExecutionPending(batchId)
  }

  async function confirmBatchCrossFilters(batchId: string) {
    const validationMessage = getBatchCrossValidation(batchId)

    if (validationMessage) {
      setBatchCrossExecutionError(batchId, validationMessage)
      return false
    }

    const payloads = buildBatchCrossExecutionPayloads(
      batchId,
      getBatchCrossFilters(batchId)
    )

    if (!payloads.length) {
      setBatchCrossExecutionError(batchId, getEmptyExecutableBatchCrossMessage())
      return false
    }

    setExecutingBatchCrossIds((current) => ({
      ...current,
      [batchId]: true
    }))
    clearBatchCrossExecutionError(batchId)

    try {
      const results = await Promise.all(
        payloads.map((payload) => executeBatchCrossAction(payload))
      )
      const failedResult = results.find((result) => !result.success || !result.data)

      if (failedResult) {
        setBatchCrossExecutionError(
          batchId,
          failedResult.error ?? 'No fue posible ejecutar el cruce.'
        )
        return false
      }

      return true
    } finally {
      setExecutingBatchCrossIds((current) => ({
        ...current,
        [batchId]: false
      }))
    }
  }

  return {
    getBatchCrossValidation,
    getBatchCrossExecutionError,
    isBatchCrossExecutionPending,
    clearBatchCrossExecutionError,
    canConfirmBatchCrossFilters,
    confirmBatchCrossFilters
  }
}
