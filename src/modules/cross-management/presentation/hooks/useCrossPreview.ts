'use client'

import { useMemo, useState, useTransition } from 'react'
import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
  ICrossFilterCondition,
  ICrossFilterColumnKey,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData
} from '../../data/models/CrossManagement'

export type CrossPreviewTab = 'planilla' | 'resumen'
export type CrossPreviewStatus = ICrossPreviewAnalysisRow['status']

type CrossFilterColumnConfig = {
  key: ICrossFilterColumnKey
  label: string
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}

function matchesSearch(cuit: string, businessName: string, search: string) {
  const normalizedSearch = normalizeSearch(search)

  if (!normalizedSearch) {
    return true
  }

  return (
    cuit.toLowerCase().includes(normalizedSearch) ||
    businessName.toLowerCase().includes(normalizedSearch)
  )
}

function parseFilterNumber(value: string) {
  const sanitized = value.trim().replace(/[^\d,.-]/g, '')

  if (!sanitized) {
    return null
  }

  const normalized = sanitized.includes(',')
    ? sanitized.replace(/\./g, '').replace(',', '.')
    : sanitized.replace(/\.(?=\d{3}(\D|$))/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

function matchesCondition(value: string, condition: ICrossFilterCondition) {
  if (!condition.operator || !condition.value.trim()) {
    return true
  }

  const rowValue = parseFilterNumber(value)
  const filterValue = parseFilterNumber(condition.value)

  if (rowValue === null || filterValue === null) {
    return false
  }

  switch (condition.operator) {
    case 'mayor':
      return rowValue > filterValue
    case 'mayor_igual':
      return rowValue >= filterValue
    case 'menor':
      return rowValue < filterValue
    case 'menor_igual':
      return rowValue <= filterValue
    case 'igual':
      return rowValue === filterValue
    case 'distinto':
      return rowValue !== filterValue
    default:
      return true
  }
}

function matchesColumnFilter(
  row: ICrossPreviewAnalysisRow,
  columnKey: ICrossFilterColumnKey,
  filter: ICrossColumnFilterState
) {
  const primaryMatches = matchesCondition(row[columnKey], filter.primary)
  const hasSecondaryFilter =
    Boolean(filter.secondary.operator) && Boolean(filter.secondary.value.trim())

  if (!hasSecondaryFilter) {
    return primaryMatches
  }

  const secondaryMatches = matchesCondition(row[columnKey], filter.secondary)

  return filter.connector === 'Y'
    ? primaryMatches && secondaryMatches
    : primaryMatches || secondaryMatches
}

function applyAnalysisFilters(
  rows: ICrossPreviewAnalysisRow[],
  filters: ICrossColumnFilters
) {
  const activeFilters = Object.entries(filters) as Array<
    [ICrossFilterColumnKey, ICrossColumnFilterState | undefined]
  >

  return rows.filter((row) =>
    activeFilters.every(([columnKey, filter]) =>
      filter ? matchesColumnFilter(row, columnKey, filter) : true
    )
  )
}

export function useCrossPreview(cross: ICrossPreviewData) {
  const [activeTab, setActiveTab] = useState<CrossPreviewTab>('planilla')
  const [planillaSearch, setPlanillaSearch] = useState('')
  const [resumenSearch, setResumenSearch] = useState('')
  const [analysisRows, setAnalysisRows] = useState(cross.analysisRows)
  const [columnFilters, setColumnFilters] = useState<ICrossColumnFilters>({})
  const [activeFilterColumn, setActiveFilterColumn] =
    useState<CrossFilterColumnConfig | null>(null)
  const [filterError, setFilterError] = useState<string | null>(null)
  const [intimationModalOpened, setIntimationModalOpened] = useState(false)
  const [exportModalOpened, setExportModalOpened] = useState(false)
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)
  const [pendingReprocessingRow, setPendingReprocessingRow] =
    useState<ICrossPreviewAnalysisRow | null>(null)
  const [isFilterPending, startFilterTransition] = useTransition()
  const [statusByCuit, setStatusByCuit] = useState<Record<string, CrossPreviewStatus>>(
    () =>
      Object.fromEntries(
        cross.analysisRows.map((row) => [row.cuit, row.status])
      )
  )

  const filteredPlanRows = useMemo(
    () =>
      cross.planRows.filter((row) =>
        matchesSearch(row.cuit, row.businessName, planillaSearch)
      ),
    [cross.planRows, planillaSearch]
  )

  const filteredAnalysisRows = useMemo(
    () =>
      analysisRows.filter((row) =>
        matchesSearch(row.cuit, row.businessName, resumenSearch)
      ),
    [analysisRows, resumenSearch]
  )

  const updateAnalysisStatus = (cuit: string, status: CrossPreviewStatus) => {
    setStatusByCuit((current) => ({
      ...current,
      [cuit]: status
    }))
  }

  const requestAnalysisStatusChange = (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => {
    if (status === 'reproceso') {
      setPendingReprocessingRow(row)
      return
    }

    updateAnalysisStatus(row.cuit, status)
  }

  const closeReprocessingModal = () => {
    setPendingReprocessingRow(null)
  }

  const confirmReprocessingModal = () => {
    if (!pendingReprocessingRow) {
      return
    }

    updateAnalysisStatus(pendingReprocessingRow.cuit, 'reproceso')
    setPendingReprocessingRow(null)
  }

  const updateTab = (tab: CrossPreviewTab) => {
    setActiveTab(tab)

    if (tab === 'planilla') {
      setPlanillaSearch('')
      return
    }

    setResumenSearch('')
  }

  const openFilterModal = (column: CrossFilterColumnConfig) => {
    setFilterError(null)
    setActiveFilterColumn(column)
  }

  const closeFilterModal = () => {
    setFilterError(null)
    setActiveFilterColumn(null)
  }

  const runFilterRequest = (nextFilters: ICrossColumnFilters, onSuccess?: () => void) => {
    startFilterTransition(() => {
      setAnalysisRows(applyAnalysisFilters(cross.analysisRows, nextFilters))
      setFilterError(null)
      onSuccess?.()
    })
  }

  const applyFilter = (
    columnKey: ICrossFilterColumnKey,
    value: ICrossColumnFilterState
  ) => {
    const nextFilters: ICrossColumnFilters = {
      ...columnFilters,
      [columnKey]: value
    }

    setColumnFilters(nextFilters)
    runFilterRequest(nextFilters, closeFilterModal)
  }

  const clearFilter = (columnKey: ICrossFilterColumnKey) => {
    const nextFilters = { ...columnFilters }
    delete nextFilters[columnKey]

    setColumnFilters(nextFilters)
    runFilterRequest(nextFilters)
  }

  return {
    activeTab,
    planillaSearch,
    resumenSearch,
    analysisRows,
    columnFilters,
    activeFilterColumn,
    filterError,
    isFilterPending,
    intimationModalOpened,
    pendingReprocessingRow,
    statusByCuit,
    filteredPlanRows,
    filteredAnalysisRows,
    updateTab,
    openFilterModal,
    closeFilterModal,
    applyFilter,
    clearFilter,
    updateAnalysisStatus,
    requestAnalysisStatusChange,
    closeReprocessingModal,
    confirmReprocessingModal,
    openIntimationModal: () => setIntimationModalOpened(true),
    closeIntimationModal: () => setIntimationModalOpened(false),
    openExportModal: () => setExportModalOpened(true),
    closeExportModal: () => setExportModalOpened(false),
    exportModalOpened,
    activePreviewIndex,
    goToPreviousPreview: () =>
      setActivePreviewIndex((current) => Math.max(current - 1, 0)),
    goToNextPreview: () =>
      setActivePreviewIndex((current) =>
        Math.min(current + 1, Math.max(cross.planRows.length - 1, 0))
      ),
    setPlanillaSearch,
    setResumenSearch
  }
}
