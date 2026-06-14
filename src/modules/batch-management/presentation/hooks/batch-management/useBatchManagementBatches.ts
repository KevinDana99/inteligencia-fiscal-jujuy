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
  const [page, setPage] = useState(initialBatchData?.page ?? 1)
  const [itemsPerPage, setItemsPerPage] = useState(
    initialBatchData?.itemsPerPage ?? DEFAULT_BATCH_MANAGEMENT_LIST_QUERY.itemsPerPage ?? 20
  )
  const [totalBatches, setTotalBatches] = useState(initialBatchData?.totalItems ?? 0)
  const [totalPages, setTotalPages] = useState(initialBatchData?.totalPages ?? 1)
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)
  const [loadingBatchId, setLoadingBatchId] = useState<string | null>(null)

  async function hydrateBatchDetail(batchId: string) {
    const result = await getBatchDetailAction(batchId)
    const batchDetail = result.data

    if (!batchDetail) {
      return
    }

    setBatches((current) => applyBatchDetailToList(current, batchId, batchDetail))
  }

  function applyBatchListData(batchListData: IBatchListData) {
    const presentationData = mapBatchListDataForPresentation(batchListData)

    setBatches(presentationData.batches)
    setPage(presentationData.page)
    setItemsPerPage(presentationData.itemsPerPage)
    setTotalBatches(presentationData.totalBatches)
    setTotalPages(presentationData.totalPages)
    setExpandedBatchId(null)
  }

  async function toggleExpandedBatch(batchId: string) {
    const isOpeningBatch = expandedBatchId !== batchId

    setExpandedBatchId((current) => (current === batchId ? null : batchId))

    if (!isOpeningBatch) {
      return
    }

    setLoadingBatchId(batchId)

    try {
      await hydrateBatchDetail(batchId)
    } finally {
      setLoadingBatchId((current) => (current === batchId ? null : current))
    }
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

      if (createdBatch) {
        setBatches(refreshedBatches)
        setPage(refreshedResult.data.page)
        setItemsPerPage(refreshedResult.data.itemsPerPage)
        setTotalBatches(refreshedResult.data.totalItems)
        setTotalPages(refreshedResult.data.totalPages)
        setExpandedBatchId(createdBatch.id)
        await hydrateBatchDetail(createdBatch.id)
        return
      }

      const fallbackCreatedBatch = buildFallbackCreatedBatch(createdSummary, parsedCuits)

      setBatches(prependCreatedBatch(refreshedBatches, fallbackCreatedBatch))
      setPage(refreshedResult.data.page)
      setItemsPerPage(refreshedResult.data.itemsPerPage)
      setTotalBatches(Math.max(refreshedResult.data.totalItems, refreshedBatches.length + 1))
      setTotalPages(refreshedResult.data.totalPages)
      setExpandedBatchId(fallbackCreatedBatch.id)
      await hydrateBatchDetail(fallbackCreatedBatch.id)
      return
    }

    const createdBatch = buildFallbackCreatedBatch(createdSummary, parsedCuits)

    setBatches((current) => prependCreatedBatch(current, createdBatch))
    setTotalBatches((current) => current + 1)
    setExpandedBatchId(createdBatch.id)
    await hydrateBatchDetail(createdBatch.id)
  }

  return {
    batches,
    page,
    itemsPerPage,
    totalBatches,
    totalPages,
    expandedBatchId,
    loadingBatchId,
    applyBatchListData,
    toggleExpandedBatch,
    handleBatchCreated
  }
}
