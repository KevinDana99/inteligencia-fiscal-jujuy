'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import {
  createBatchAction,
  getBatchManagementAction,
  getBatchDetailAction,
  previewBatchLoadAction
} from '../../data/actions'
import type {
  IBatchCreatedSummary,
  IBatchCrossFilters,
  IBatchCrossSectionFilters,
  IBatchLoadedCuitRow,
  IBatchListData,
  IBatchManagementItem,
  IBatchManagementItems,
  IBatchPreviewData
} from '../../data/models/BatchManagement'

const CURRENT_DATE = new Date()
const CURRENT_YEAR = CURRENT_DATE.getFullYear()
const CURRENT_MONTH = String(CURRENT_DATE.getMonth() + 1).padStart(2, '0')

function createDefaultCrossSection(
  type: 'monthly' | 'annual'
): IBatchCrossSectionFilters {
  return {
    isOpen: false,
    fromYear: String(CURRENT_YEAR),
    toYear: String(CURRENT_YEAR),
    fromMonth: type === 'monthly' ? CURRENT_MONTH : null,
    toMonth: type === 'monthly' ? CURRENT_MONTH : null,
    crossTypes: []
  }
}

function createDefaultBatchCrossFilters(): IBatchCrossFilters {
  return {
    monthly: createDefaultCrossSection('monthly'),
    annual: createDefaultCrossSection('annual')
  }
}

const SEARCH_DEBOUNCE_MS = 300

interface IBatchCreateForm {
  batchNumber: string
  name: string
  regime: string | null
  description: string
  cuitsText: string
  file: File | null
}

const EMPTY_BATCH_CREATE_FORM: IBatchCreateForm = {
  batchNumber: '',
  name: '',
  regime: null,
  description: '',
  cuitsText: '',
  file: null
}

function formatDateLabel(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = String(parsedDate.getFullYear())

  return `${day}/${month}/${year}`
}

function mapBatchForPresentation(batch: IBatchManagementItem): IBatchManagementItem {
  return {
    ...batch,
    createdAt: formatDateLabel(batch.createdAt)
  }
}

function getInitialBatches(initialBatchData?: IBatchListData | null): IBatchManagementItems {
  return initialBatchData?.batches?.length
    ? initialBatchData.batches.map(mapBatchForPresentation)
    : []
}

export function useBatchManagement(initialBatchData?: IBatchListData | null) {
  const [batches, setBatches] = useState<IBatchManagementItems>(getInitialBatches(initialBatchData))
  const [totalBatches, setTotalBatches] = useState<number>(initialBatchData?.totalItems ?? 0)
  const [searchValue, setSearchValue] = useState('')
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState<IBatchCreateForm>(EMPTY_BATCH_CREATE_FORM)
  const [loadedCuits, setLoadedCuits] = useState<IBatchLoadedCuitRow[]>([])
  const [previewData, setPreviewData] = useState<IBatchPreviewData | null>(null)
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false)
  const [batchCrossFilters, setBatchCrossFilters] = useState<
    Record<string, IBatchCrossFilters>
  >({})
  const [isPreviewPending, startPreviewTransition] = useTransition()
  const [isCreatePending, startCreateTransition] = useTransition()
  const [isSearchPending, startSearchTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  const filteredBatches = useMemo(() => batches, [batches])

  const toggleExpandedBatch = (batchId: string) => {
    setExpandedBatchId((current) => (current === batchId ? null : batchId))

    void (async () => {
      const result = await getBatchDetailAction(batchId)

      if (!result.data) {
        return
      }

      setBatches((current) =>
        current.map((batch) =>
          batch.id === batchId && result.data
            ? mapBatchForPresentation(result.data)
            : batch
        )
      )
    })()
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
    setLoadedCuits([])
    setPreviewData(null)
    setIsImportPreviewOpen(false)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setLoadedCuits([])
    setPreviewData(null)
    setIsImportPreviewOpen(false)
  }

  const updateSearchValue = (value: string) => {
    setSearchValue(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    const requestId = latestSearchRequestIdRef.current + 1
    latestSearchRequestIdRef.current = requestId

    searchTimeoutRef.current = setTimeout(() => {
      startSearchTransition(() => {
        void (async () => {
          const result = await getBatchManagementAction({
            search: value.trim() || null
          })

          if (latestSearchRequestIdRef.current !== requestId || !result.data) {
            return
          }

          setBatches(result.data.batches.map(mapBatchForPresentation))
          setTotalBatches(result.data.totalItems)
        })()
      })
    }, SEARCH_DEBOUNCE_MS)
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
      .split(/[,\n;\t ]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const createBatch = () => {
    const batchNumber = createForm.batchNumber.trim()
    const name = createForm.name.trim()
    const regime = createForm.regime?.trim() ?? ''
    const description = createForm.description.trim()
    const parsedCuits = loadedCuits.map((row) => row.cuit)

    if (!batchNumber || !name || !regime || !parsedCuits.length) {
      return false
    }

    startCreateTransition(() => {
      void (async () => {
        const result = await createBatchAction({
          name,
          description,
          regime,
          cuitsText: parsedCuits.join('\n'),
          file: createForm.file
        })

        if (!result.success || !result.data) {
          return
        }

        const createdSummary: IBatchCreatedSummary = result.data
        const newBatch: IBatchManagementItem = {
          id: createdSummary.id,
          batchNumber: createdSummary.formattedNumber,
          name: createdSummary.name,
          description: createdSummary.description ?? '',
          regime: createdSummary.regime,
          cuitCount: createdSummary.cuitCount,
          createdAt: formatDateLabel(createdSummary.createdAt),
          createdBy: null,
          cuits: parsedCuits.map((cuit, index) => ({
            id: `${createdSummary.id}-${index + 1}`,
            cuit: cuit.replace(/\D/g, ''),
            businessName: null,
            regime: createdSummary.regime,
            order: index + 1
          }))
        }

        setBatches((current) => [newBatch, ...current])
        setTotalBatches((current) => current + 1)
        setExpandedBatchId(newBatch.id)
        setIsCreateModalOpen(false)
        setCreateForm(EMPTY_BATCH_CREATE_FORM)
        setLoadedCuits([])
        setPreviewData(null)
      })()
    })

    return true
  }

  const openImportPreview = (file: File) => {
    setCreateForm((current) => ({
      ...current,
      file
    }))

    startPreviewTransition(() => {
      void (async () => {
        const result = await previewBatchLoadAction({
          file,
          regime: createForm.regime,
          cuitsText: createForm.cuitsText
        })

        if (!result.success || !result.data) {
          return
        }

        setPreviewData(result.data)
        setIsImportPreviewOpen(true)
      })()
    })
  }

  const closeImportPreview = () => {
    setIsImportPreviewOpen(false)
  }

  const confirmImportPreview = () => {
    if (!previewData) {
      return
    }

    const validImportedCuits: IBatchLoadedCuitRow[] = previewData.records
      .filter((row) => row.status === 'valid' && row.normalizedCuit)
      .map((row, index) => ({
        id: `import-${index + 1}-${row.normalizedCuit ?? row.originalCuit}`,
        cuit: row.originalCuit,
        businessName: row.businessName,
        source: 'import'
      }))

    setLoadedCuits(validImportedCuits)
    setIsImportPreviewOpen(false)
  }

  const addManualCuits = (rawValue: string) => {
    const parsedValues = parseCuits(rawValue)

    if (!parsedValues.length) {
      return 0
    }

    const normalizedExisting = new Set(
      loadedCuits.map((row) => row.cuit.replace(/\D/g, ''))
    )

    const nextRows = parsedValues.reduce<IBatchLoadedCuitRow[]>((accumulator, value, index) => {
      const normalizedCuit = value.replace(/\D/g, '')

      if (!normalizedCuit || normalizedExisting.has(normalizedCuit)) {
        return accumulator
      }

      normalizedExisting.add(normalizedCuit)
      accumulator.push({
        id: `manual-${Date.now()}-${index}-${normalizedCuit}`,
        cuit: value,
        businessName: null,
        source: 'manual'
      })

      return accumulator
    }, [])

    if (!nextRows.length) {
      return 0
    }

    setLoadedCuits((current) => [...current, ...nextRows])
    return nextRows.length
  }

  const removeLoadedCuit = (rowId: string) => {
    setLoadedCuits((current) => current.filter((row) => row.id !== rowId))
  }

  const getBatchCrossFilters = (batchId: string) => {
    return batchCrossFilters[batchId] ?? createDefaultBatchCrossFilters()
  }

  const setBatchCrossYear = (
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) => {
    if (!value) {
      return
    }

    setBatchCrossFilters((current) => ({
      ...current,
      [batchId]: {
        ...getBatchCrossFilters(batchId),
        [section]: {
          ...getBatchCrossFilters(batchId)[section],
          [field]: value
        }
      }
    }))
  }

  const setBatchCrossMonth = (
    batchId: string,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromMonth' | 'toMonth'>,
    value: string | null
  ) => {
    if (!value) {
      return
    }

    setBatchCrossFilters((current) => ({
      ...current,
      [batchId]: {
        ...getBatchCrossFilters(batchId),
        monthly: {
          ...getBatchCrossFilters(batchId).monthly,
          [field]: value
        }
      }
    }))
  }

  const toggleBatchCrossSection = (batchId: string, section: keyof IBatchCrossFilters) => {
    setBatchCrossFilters((current) => ({
      ...current,
      [batchId]: {
        ...getBatchCrossFilters(batchId),
        [section]: {
          ...getBatchCrossFilters(batchId)[section],
          isOpen: !getBatchCrossFilters(batchId)[section].isOpen
        }
      }
    }))
  }

  const toggleBatchCrossType = (
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) => {
    setBatchCrossFilters((current) => {
      const batchFilters = current[batchId] ?? createDefaultBatchCrossFilters()
      const sectionFilters = batchFilters[section]
      const isSelected = sectionFilters.crossTypes.includes(crossType)

      return {
        ...current,
        [batchId]: {
          ...batchFilters,
          [section]: {
            ...sectionFilters,
            crossTypes: isSelected
              ? sectionFilters.crossTypes.filter((item) => item !== crossType)
              : [...sectionFilters.crossTypes, crossType]
          }
        }
      }
    })
  }

  const getBatchCrossValidationMessage = (batchId: string) => {
    const filters = getBatchCrossFilters(batchId)
    const monthlyFrom = Number(`${filters.monthly.fromYear}${filters.monthly.fromMonth ?? '01'}`)
    const monthlyTo = Number(`${filters.monthly.toYear}${filters.monthly.toMonth ?? '01'}`)
    const annualFrom = Number(filters.annual.fromYear)
    const annualTo = Number(filters.annual.toYear)

    if (
      filters.monthly.crossTypes.length &&
      filters.monthly.fromMonth &&
      filters.monthly.toMonth &&
      monthlyFrom > monthlyTo
    ) {
      return 'Debes especificar un rango válido para realizar el cruce'
    }

    if (filters.annual.crossTypes.length && annualFrom > annualTo) {
      return 'Debes especificar un rango válido para realizar el cruce'
    }

    return null
  }

  const canConfirmBatchCrossFilters = (batchId: string) => {
    const filters = getBatchCrossFilters(batchId)
    const hasSelectedCrosses =
      filters.monthly.crossTypes.length > 0 || filters.annual.crossTypes.length > 0

    if (!hasSelectedCrosses) {
      return false
    }

    return !getBatchCrossValidationMessage(batchId)
  }

  const confirmBatchCrossFilters = (batchId: string) => {
    void batchId
  }

  return {
    totalBatches,
    filteredBatches,
    searchValue,
    isSearchPending,
    expandedBatchId,
    isCreateModalOpen,
    createForm,
    loadedCuits,
    previewData,
    isImportPreviewOpen,
    isPreviewPending,
    isCreatePending,
    getBatchCrossFilters,
    getBatchCrossValidationMessage,
    canConfirmBatchCrossFilters,
    setSearchValue: updateSearchValue,
    toggleExpandedBatch,
    toggleBatchCrossSection,
    setBatchCrossYear,
    setBatchCrossMonth,
    toggleBatchCrossType,
    confirmBatchCrossFilters,
    openCreateModal,
    closeCreateModal,
    setCreateFormField,
    createBatch,
    addManualCuits,
    removeLoadedCuit,
    openImportPreview,
    closeImportPreview,
    confirmImportPreview
  }
}
