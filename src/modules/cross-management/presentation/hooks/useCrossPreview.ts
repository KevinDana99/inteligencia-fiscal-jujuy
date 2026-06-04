'use client'

import { useMemo, useState, useTransition } from 'react'
import { filterCrossAnalysisAction } from '../../data/actions'
import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
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
    startFilterTransition(async () => {
      const result = await filterCrossAnalysisAction({
        crossId: cross.id,
        filters: nextFilters
      })

      if (!result.data) {
        setFilterError(result.error ?? 'No fue posible aplicar los filtros.')
        return
      }

      setAnalysisRows(result.data.rows)
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
    setPlanillaSearch,
    setResumenSearch
  }
}
