'use client'

import { useMemo, useState } from 'react'
import type {
  IBatchCrossFilters,
  IBatchManagementItem,
  IBatchManagementItems
} from '../../data/models/BatchManagement'
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
  const [batches, setBatches] = useState<IBatchManagementItems>(batchManagementMock)
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
      return batches
    }

    return batches.filter(
      (batch) =>
        batch.batchNumber.toLowerCase().includes(normalizedSearch) ||
        batch.name.toLowerCase().includes(normalizedSearch)
    )
  }, [batches, searchValue])

  const toggleExpandedBatch = (batchId: string) => {
    setExpandedBatchId((current) => (current === batchId ? null : batchId))
  }

  const getNextBatchNumber = () => {
    const maxBatchNumber = batches.reduce((maxValue, batch) => {
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

  const parseCuits = (cuitsText: string) => {
    return cuitsText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const getCurrentDateLabel = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear())

    return `${day}/${month}/${year}`
  }

  const createBatch = () => {
    const batchNumber = createForm.batchNumber.trim()
    const name = createForm.name.trim()
    const regime = createForm.regime?.trim() ?? ''
    const description = createForm.description.trim()
    const parsedCuits = parseCuits(createForm.cuitsText)

    if (!batchNumber || !name || !regime || !parsedCuits.length) {
      return false
    }

    const newBatch: IBatchManagementItem = {
      id: batchNumber,
      batchNumber,
      name,
      description,
      cuitCount: parsedCuits.length,
      createdAt: getCurrentDateLabel(),
      cuits: parsedCuits.map((cuit, index) => ({
        id: `${batchNumber}-${index + 1}`,
        cuit,
        businessName: 'CUIT importado',
        regime
      }))
    }

    setBatches((current) => [newBatch, ...current])
    setExpandedBatchId(newBatch.id)
    setIsCreateModalOpen(false)
    setCreateForm(EMPTY_BATCH_CREATE_FORM)

    return true
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
    totalBatches: batches.length,
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
    setCreateFormField,
    createBatch
  }
}
