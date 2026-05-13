'use client'

import { useMemo, useState } from 'react'
import { batchManagementMock } from '../../data/sources/mock/fixtures/batches'

export function useBatchManagement() {
  const [searchValue, setSearchValue] = useState('')
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)

  const filteredBatches = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return batchManagementMock
    }

    return batchManagementMock.filter((batch) =>
      batch.batchNumber.toLowerCase().includes(normalizedSearch)
    )
  }, [searchValue])

  const toggleExpandedBatch = (batchId: string) => {
    setExpandedBatchId((current) => (current === batchId ? null : batchId))
  }

  return {
    totalBatches: batchManagementMock.length,
    filteredBatches,
    searchValue,
    expandedBatchId,
    setSearchValue,
    toggleExpandedBatch
  }
}
