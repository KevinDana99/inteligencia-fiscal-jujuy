'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import {
  createBatchAction,
  executeBatchCrossAction,
  getBatchManagementAction,
  getBatchDetailAction,
  previewBatchLoadAction
} from '../../data/actions'
import type {
  IBatchCreatedSummary,
  IBatchCrossExecutionPayload,
  IBatchCrossFilters,
  IBatchCrossSectionFilters,
  IBatchLoadedCuitRow,
  IBatchListData,
  IBatchManagementItem,
  IBatchManagementItems,
  IBatchPreviewData
} from '../../data/models/BatchManagement'
import {
  buildAnnualCrossPeriod,
  buildMonthlyCrossPeriod
} from '../utils/batchCrossPeriods'

const CURRENT_DATE = new Date()
const CURRENT_YEAR = CURRENT_DATE.getFullYear()
const CURRENT_MONTH = String(CURRENT_DATE.getMonth() + 1).padStart(2, '0')
const BATCH_CROSS_OPTIONS_BY_LABEL = {
  'Control de desvio de BI - Regimen Gral': {
    legacyCode: 'CONTROL_DESVIO_BI_REGIMEN_GRAL'
  },
  'Control de desvio de BI - Regimen CM': {
    legacyCode: 'CONTROL_DESVIO_BI_REGIMEN_CM',
    publicCode: 'desvio-bi-convenio-multilateral',
    version: '1.0.0'
  },
  'Control de BI declarada por actividad': {
    legacyCode: 'CONTROL_BI_DECLARADA_POR_ACTIVIDAD'
  },
  'Control de creditos': {
    legacyCode: 'CONTROL_CREDITOS'
  },
  'Control de SAF': {
    legacyCode: 'CONTROL_SAF'
  },
  'Control de Agentes': {
    legacyCode: 'CONTROL_AGENTES'
  },
  'Deteccion de no inscriptos': {
    legacyCode: 'DETECCION_CONTRIBUYENTES_NO_INSCRIPTOS'
  },
  'Comparacion de Bases Presuntivas': {
    legacyCode: 'COMPARACION_BASES_PRESUNTIVAS'
  },
  'Contribuyentes con más de dos inmuebles': {
    legacyCode: 'CONTRIBUYENTES_MAS_DOS_INMUEBLES'
  }
} as const
const SUPPORTED_PUBLIC_BATCH_CROSS_LABELS = Object.entries(
  BATCH_CROSS_OPTIONS_BY_LABEL
)
  .filter(([, config]) => 'publicCode' in config)
  .map(([label]) => label)
const EMPTY_EXECUTABLE_CROSS_MESSAGE = `Seleccioná un cruce disponible: ${SUPPORTED_PUBLIC_BATCH_CROSS_LABELS.join(', ')}.`

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

function getBatchCrossOption(crossType: string) {
  return BATCH_CROSS_OPTIONS_BY_LABEL[
    crossType as keyof typeof BATCH_CROSS_OPTIONS_BY_LABEL
  ] ?? null
}

function buildBatchCrossExecutionPayloads(
  batchId: string,
  filters: IBatchCrossFilters
): IBatchCrossExecutionPayload[] {
  const monthlyPeriod = buildMonthlyCrossPeriod(filters.monthly, CURRENT_MONTH)
  const annualPeriod = buildAnnualCrossPeriod(filters.annual)

  return [
    ...filters.monthly.crossTypes.map((crossType) => ({
      crossType,
      ...monthlyPeriod
    })),
    ...filters.annual.crossTypes.map((crossType) => ({
      crossType,
      ...annualPeriod
    }))
  ].reduce<IBatchCrossExecutionPayload[]>((payloads, selection) => {
    const option = getBatchCrossOption(selection.crossType)

    if (!option || !('publicCode' in option)) {
      return payloads
    }

    payloads.push({
      batchId,
      crossCode: option.publicCode,
      crossVersion: option.version,
      periodFrom: selection.periodFrom,
      periodTo: selection.periodTo
    })

    return payloads
  }, [])
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
  const [loadedCuitsSearchValue, setLoadedCuitsSearchValue] = useState('')
  const [previewData, setPreviewData] = useState<IBatchPreviewData | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false)
  const [batchCrossFilters, setBatchCrossFilters] = useState<
    Record<string, IBatchCrossFilters>
  >({})
  const [batchCrossExecutionErrors, setBatchCrossExecutionErrors] = useState<
    Record<string, string | null>
  >({})
  const [executingBatchCrossIds, setExecutingBatchCrossIds] = useState<
    Record<string, boolean>
  >({})
  const [isPreviewPending, startPreviewTransition] = useTransition()
  const [isCreatePending, startCreateTransition] = useTransition()
  const [isSearchPending, startSearchTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  const filteredBatches = useMemo(() => batches, [batches])

  const filteredLoadedCuits = useMemo(() => {
    const normalizedSearch = loadedCuitsSearchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return loadedCuits
    }

    return loadedCuits.filter((row) => {
      const cuitValue = row.cuit.toLowerCase()
      const businessName = row.businessName?.toLowerCase() ?? ''

      return cuitValue.includes(normalizedSearch) || businessName.includes(normalizedSearch)
    })
  }, [loadedCuits, loadedCuitsSearchValue])

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
    setLoadedCuitsSearchValue('')
    setPreviewData(null)
    setPreviewError(null)
    setCreateError(null)
    setIsImportPreviewOpen(false)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setLoadedCuits([])
    setLoadedCuitsSearchValue('')
    setPreviewData(null)
    setPreviewError(null)
    setCreateError(null)
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
    setCreateError(null)
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

    setCreateError(null)
    startCreateTransition(() => {
      void (async () => {
        const result = await createBatchAction({
          name,
          description,
          regime,
          cuitsText: parsedCuits.join('\n'),
          file: null
        })

        if (!result.success || !result.data) {
          setCreateError(result.error ?? 'No fue posible crear el lote.')
          return
        }

        const createdSummary: IBatchCreatedSummary = result.data
        const refreshedResult = await getBatchManagementAction()

        if (refreshedResult.data) {
          const refreshedBatches =
            refreshedResult.data.batches.map(mapBatchForPresentation)
          const createdBatch =
            refreshedBatches.find(
              (batch) =>
                batch.name === createdSummary.name &&
                batch.batchNumber === createdSummary.formattedNumber
            ) ?? refreshedBatches[0]

          setBatches(refreshedBatches)
          setTotalBatches(refreshedResult.data.totalItems)
          setExpandedBatchId(createdBatch?.id ?? null)
        } else {
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
        }

        setIsCreateModalOpen(false)
        setCreateForm(EMPTY_BATCH_CREATE_FORM)
        setLoadedCuits([])
        setLoadedCuitsSearchValue('')
        setPreviewData(null)
        setPreviewError(null)
        setCreateError(null)
      })()
    })

    return true
  }

  const openImportPreview = (file: File) => {
    setPreviewError(null)

    startPreviewTransition(() => {
      void (async () => {
        const result = await previewBatchLoadAction({
          file,
          regime: createForm.regime,
          cuitsText: createForm.cuitsText
        })

        if (!result.success || !result.data) {
          setCreateForm((current) => ({
            ...current,
            file: null
          }))
          setPreviewData(null)
          setIsImportPreviewOpen(false)
          setPreviewError(
            result.error ?? 'No fue posible previsualizar el archivo importado.'
          )
          return
        }

        setPreviewData(result.data)
        setPreviewError(null)
        setIsImportPreviewOpen(true)
      })()
    })
  }

  const closeImportPreview = () => {
    setCreateForm((current) => ({
      ...current,
      file: null
    }))
    setIsImportPreviewOpen(false)
  }

  const confirmImportPreview = (acceptedNormalizedCuits: string[] = []) => {
    if (!previewData) {
      return
    }

    const normalizedExisting = new Set(
      loadedCuits.map((row) => row.cuit.replace(/\D/g, ''))
    )

    const acceptedNormalizedSet = new Set(
      acceptedNormalizedCuits.map((cuit) => cuit.replace(/\D/g, ''))
    )

    const validImportedCuits: IBatchLoadedCuitRow[] = previewData.records
      .filter(
        (row) =>
          (row.status === 'valid' && row.normalizedCuit) ||
          (row.status !== 'valid' &&
            row.normalizedCuit &&
            acceptedNormalizedSet.has(row.normalizedCuit.replace(/\D/g, '')))
      )
      .reduce<IBatchLoadedCuitRow[]>((accumulator, row, index) => {
        const normalizedCuit = row.normalizedCuit ?? row.originalCuit.replace(/\D/g, '')

        if (!normalizedCuit || normalizedExisting.has(normalizedCuit)) {
          return accumulator
        }

        normalizedExisting.add(normalizedCuit)
        accumulator.push({
          id: `import-${index + 1}-${normalizedCuit}`,
          cuit:
            row.status === 'valid'
              ? row.originalCuit
              : row.normalizedCuit ?? row.originalCuit,
          businessName: row.businessName,
          source: 'import'
        })

        return accumulator
      }, [])

    setLoadedCuits((current) => [...current, ...validImportedCuits])
    setCreateForm((current) => ({
      ...current,
      file: null
    }))
    setPreviewError(null)
    setCreateError(null)
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
    setCreateError(null)
    return nextRows.length
  }

  const removeLoadedCuit = (rowId: string) => {
    setLoadedCuits((current) => current.filter((row) => row.id !== rowId))
  }

  const getBatchCrossFilters = (batchId: string) => {
    return batchCrossFilters[batchId] ?? createDefaultBatchCrossFilters()
  }

  const getBatchCrossExecutionError = (batchId: string) => {
    return batchCrossExecutionErrors[batchId] ?? null
  }

  const isBatchCrossExecutionPending = (batchId: string) => {
    return executingBatchCrossIds[batchId] ?? false
  }

  const clearBatchCrossExecutionError = (batchId: string) => {
    setBatchCrossExecutionErrors((current) => ({
      ...current,
      [batchId]: null
    }))
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

    clearBatchCrossExecutionError(batchId)
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

    clearBatchCrossExecutionError(batchId)
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
    clearBatchCrossExecutionError(batchId)
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
    clearBatchCrossExecutionError(batchId)
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
    const hasExecutableCrosses =
      buildBatchCrossExecutionPayloads(batchId, filters).length > 0

    if (!hasExecutableCrosses) {
      return false
    }

    return !getBatchCrossValidationMessage(batchId) && !isBatchCrossExecutionPending(batchId)
  }

  const confirmBatchCrossFilters = async (batchId: string) => {
    const validationMessage = getBatchCrossValidationMessage(batchId)

    if (validationMessage) {
      setBatchCrossExecutionErrors((current) => ({
        ...current,
        [batchId]: validationMessage
      }))
      return false
    }

    const payloads = buildBatchCrossExecutionPayloads(
      batchId,
      getBatchCrossFilters(batchId)
    )

    if (!payloads.length) {
      setBatchCrossExecutionErrors((current) => ({
        ...current,
        [batchId]: EMPTY_EXECUTABLE_CROSS_MESSAGE
      }))
      return false
    }

    setExecutingBatchCrossIds((current) => ({
      ...current,
      [batchId]: true
    }))
    setBatchCrossExecutionErrors((current) => ({
      ...current,
      [batchId]: null
    }))

    try {
      const results = await Promise.all(
        payloads.map((payload) => executeBatchCrossAction(payload))
      )
      const failedResult = results.find((result) => !result.success || !result.data)

      if (failedResult) {
        setBatchCrossExecutionErrors((current) => ({
          ...current,
          [batchId]: failedResult.error ?? 'No fue posible ejecutar el cruce.'
        }))
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
    totalBatches,
    filteredBatches,
    searchValue,
    isSearchPending,
    expandedBatchId,
    isCreateModalOpen,
    createForm,
    loadedCuits,
    loadedCuitsSearchValue,
    filteredLoadedCuits,
    previewData,
    previewError,
    createError,
    isImportPreviewOpen,
    isPreviewPending,
    isCreatePending,
    getBatchCrossFilters,
    getBatchCrossValidationMessage,
    getBatchCrossExecutionError,
    isBatchCrossExecutionPending,
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
    setLoadedCuitsSearchValue,
    createBatch,
    addManualCuits,
    removeLoadedCuit,
    openImportPreview,
    closeImportPreview,
    confirmImportPreview
  }
}
