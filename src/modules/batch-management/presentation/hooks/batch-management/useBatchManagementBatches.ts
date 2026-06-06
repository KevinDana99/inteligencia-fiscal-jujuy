'use client'

import { useState } from 'react'
import { getBatchDetailAction, getBatchManagementAction } from '../../../data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from '../../../constants'
import type {
  IBatchCreatedSummary,
  IBatchListData,
  IBatchManagementItems
} from '../../../data/models/BatchManagement'
import {
  applyBatchDetailToList,
  buildFallbackCreatedBatch,
  findCreatedBatch,
  getInitialBatches,
  mapBatchListDataForPresentation,
  prependCreatedBatch
} from '../../utils'

export function useBatchManagementBatches(initialBatchData?: IBatchListData | null) {
  const [batches, setBatches] = useState<IBatchManagementItems>(() =>
    getInitialBatches(initialBatchData)
  )
  const [totalBatches, setTotalBatches] = useState(initialBatchData?.totalItems ?? 0)
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)

  function applyBatchListData(batchListData: IBatchListData) {
    const presentationData = mapBatchListDataForPresentation(batchListData)

    setBatches(presentationData.batches)
    setTotalBatches(presentationData.totalBatches)
  }

  async function toggleExpandedBatch(batchId: string) {
    setExpandedBatchId((current) => (current === batchId ? null : batchId))

    const result = await getBatchDetailAction(batchId)

    if (!result.data) {
      return
    }

    const batchDetail = result.data

    setBatches((current) =>
      applyBatchDetailToList(current, batchId, batchDetail)
    )
  }

  async function handleBatchCreated(
    createdSummary: IBatchCreatedSummary,
    parsedCuits: string[]
  ) {
    const refreshedResult = await getBatchManagementAction(
      DEFAULT_BATCH_MANAGEMENT_LIST_QUERY
    )

    if (refreshedResult.data) {
      const refreshedBatches =
        mapBatchListDataForPresentation(refreshedResult.data).batches
      const createdBatch = findCreatedBatch(refreshedBatches, createdSummary)

      setBatches(refreshedBatches)
      setTotalBatches(refreshedResult.data.totalItems)
      setExpandedBatchId(createdBatch?.id ?? null)
      return
    }

    const createdBatch = buildFallbackCreatedBatch(createdSummary, parsedCuits)

    setBatches((current) => prependCreatedBatch(current, createdBatch))
    setTotalBatches((current) => current + 1)
    setExpandedBatchId(createdBatch.id)
  }

  return {
    batches,
    totalBatches,
    expandedBatchId,
    applyBatchListData,
    toggleExpandedBatch,
    handleBatchCreated
  }
}
