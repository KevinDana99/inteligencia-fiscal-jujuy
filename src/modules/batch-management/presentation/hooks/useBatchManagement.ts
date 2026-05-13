'use client'

import { useMemo, useState } from 'react'
import type { IBatchCrossFilters } from '../../data/models/BatchManagement'
import { batchManagementMock } from '../../data/sources/mock/fixtures/batches'

const DEFAULT_BATCH_CROSS_FILTERS: IBatchCrossFilters = {
  fromYear: '2024',
  toYear: '2025',
  crossTypes: []
}

interface IBatchCreateForm {
  batchNumber: string
  name: string
  regime: string | null
  description: string
  cuitsText: string
}

const EMPTY_BATCH_CREATE_FORM: IBatchCreateForm = {
  batchNumber: '',
  name: '',
  regime: null,
  description: '',
  cuitsText: ''
}

export function useBatchManagement() {
  const [searchValue, setSearchValue] = useState('')
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState<IBatchCreateForm>(EMPTY_BATCH_CREATE_FORM)
  const [batchCrossFilters, setBatchCrossFilters] = useState<
    Record<string, IBatchCrossFilters>
  >({})

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

  const getNextBatchNumber = () => {
    const maxBatchNumber = batchManagementMock.reduce((maxValue, batch) => {
      const numericValue = Number(batch.batchNumber)
      return Number.isNaN(numericValue) ? maxValue : Math.max(maxValue, numericValue)
    }, 0)

    return String(maxBatchNumber + 1)
  }

  const openCreateModal = () => {
    setCreateForm({
      ...EMPTY_BATCH_CREATE_FORM,
      batchNumber: getNextBatchNumber()
    })
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const setCreateFormField = <TField extends keyof IBatchCreateForm>(
    field: TField,
    value: IBatchCreateForm[TField]
  ) => {
    setCreateForm((current) => ({
      ...current,
      [field]: value
    }))
  }

  const getBatchCrossFilters = (batchId: string) => {
    return batchCrossFilters[batchId] ?? DEFAULT_BATCH_CROSS_FILTERS
  }

  const setBatchCrossYear = (
    batchId: string,
    field: keyof Pick<IBatchCrossFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) => {
    if (!value) {
      return
    }

    setBatchCrossFilters((current) => ({
      ...current,
      [batchId]: {
        ...getBatchCrossFilters(batchId),
        [field]: value
      }
    }))
  }

  const toggleBatchCrossType = (batchId: string, crossType: string) => {
    setBatchCrossFilters((current) => {
      const batchFilters = current[batchId] ?? DEFAULT_BATCH_CROSS_FILTERS
      const isSelected = batchFilters.crossTypes.includes(crossType)

      return {
        ...current,
        [batchId]: {
          ...batchFilters,
          crossTypes: isSelected
            ? batchFilters.crossTypes.filter((item) => item !== crossType)
            : [...batchFilters.crossTypes, crossType]
        }
      }
    })
  }

  const confirmBatchCrossFilters = (batchId: string) => {
    return getBatchCrossFilters(batchId)
  }

  return {
    totalBatches: batchManagementMock.length,
    filteredBatches,
    searchValue,
    expandedBatchId,
    isCreateModalOpen,
    createForm,
    getBatchCrossFilters,
    setSearchValue,
    toggleExpandedBatch,
    setBatchCrossYear,
    toggleBatchCrossType,
    confirmBatchCrossFilters,
    openCreateModal,
    closeCreateModal,
    setCreateFormField
  }
}
