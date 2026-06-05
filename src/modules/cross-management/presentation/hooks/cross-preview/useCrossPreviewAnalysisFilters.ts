'use client'

import { useCallback, useState, useTransition } from 'react'
import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
  ICrossFilterColumnKey,
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import { filterCrossPreviewAnalysisRows } from '../../utils/filterCrossPreviewAnalysisRows'

export type CrossFilterColumnConfig = {
  key: ICrossFilterColumnKey
  label: string
}

interface UseCrossPreviewAnalysisFiltersParams {
  rows: ICrossPreviewAnalysisRow[]
}

export function useCrossPreviewAnalysisFilters({
  rows
}: UseCrossPreviewAnalysisFiltersParams) {
  const [analysisRows, setAnalysisRows] = useState(rows)
  const [columnFilters, setColumnFilters] = useState<ICrossColumnFilters>({})
  const [activeFilterColumn, setActiveFilterColumn] =
    useState<CrossFilterColumnConfig | null>(null)
  const [filterError, setFilterError] = useState<string | null>(null)
  const [isFilterPending, startFilterTransition] = useTransition()

  const closeFilterModal = useCallback(() => {
    setFilterError(null)
    setActiveFilterColumn(null)
  }, [])

  const openFilterModal = useCallback((column: CrossFilterColumnConfig) => {
    setFilterError(null)
    setActiveFilterColumn(column)
  }, [])

  const runFilterRequest = useCallback(
    (nextFilters: ICrossColumnFilters, onSuccess?: () => void) => {
      startFilterTransition(() => {
        setAnalysisRows(filterCrossPreviewAnalysisRows(rows, nextFilters))
        setFilterError(null)
        onSuccess?.()
      })
    },
    [rows]
  )

  const applyFilter = useCallback(
    (columnKey: ICrossFilterColumnKey, value: ICrossColumnFilterState) => {
      const nextFilters: ICrossColumnFilters = {
        ...columnFilters,
        [columnKey]: value
      }

      setColumnFilters(nextFilters)
      runFilterRequest(nextFilters, closeFilterModal)
    },
    [closeFilterModal, columnFilters, runFilterRequest]
  )

  const clearFilter = useCallback(
    (columnKey: ICrossFilterColumnKey) => {
      const nextFilters = { ...columnFilters }
      delete nextFilters[columnKey]

      setColumnFilters(nextFilters)
      runFilterRequest(nextFilters)
    },
    [columnFilters, runFilterRequest]
  )

  return {
    activeFilterColumn,
    analysisRows,
    applyFilter,
    clearFilter,
    closeFilterModal,
    columnFilters,
    filterError,
    isFilterPending,
    openFilterModal
  }
}
