'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { getCrossResumenAction } from '../../../data/actions'
import {
  mapAnalysisRowsToPreview,
  mapSummaryBlocksToPreview
} from '../../../data/mappers/mapCrossPreviewContractToView'
import type {
  ICrossColumnFilters,
  ICrossColumnFilterState,
  ICrossDynamicColumn,
  ICrossFilterColumnKey,
  ICrossPaginationData,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewSummaryBlock
} from '../../../data/models/CrossManagement'
import { mapCrossColumnFiltersToResumenRequest } from '../../../data/utils/crossPreviewFilters'

export type CrossFilterColumnConfig = {
  allowedOperators: ICrossDynamicColumn['allowedOperators']
  key: ICrossFilterColumnKey
  label: string
  title: string
  type: ICrossDynamicColumn['type']
}

interface UseCrossPreviewResumenQueryParams {
  cross: ICrossPreviewData
}

export function useCrossPreviewResumenQuery({
  cross
}: UseCrossPreviewResumenQueryParams) {
  const latestRequestRef = useRef(0)
  const [summaryBlocks, setSummaryBlocks] = useState<ICrossPreviewSummaryBlock[]>(
    cross.summaryBlocks
  )
  const [analysisColumns, setAnalysisColumns] = useState<ICrossDynamicColumn[]>(
    cross.analysisColumns
  )
  const [analysisRows, setAnalysisRows] = useState<ICrossPreviewAnalysisRow[]>(
    cross.analysisRows
  )
  const [pagination, setPagination] = useState<ICrossPaginationData>(
    cross.analysisPagination
  )
  const [search, setSearchState] = useState('')
  const [columnFilters, setColumnFilters] = useState<ICrossColumnFilters>({})
  const [activeFilterColumn, setActiveFilterColumn] =
    useState<CrossFilterColumnConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filterableColumns = useMemo(
    () =>
      analysisColumns
        .filter((column) => column.isFilterable)
        .map((column) => ({
          allowedOperators: column.allowedOperators,
          key: column.key,
          label: column.label,
          title: column.label,
          type: column.type
        })),
    [analysisColumns]
  )

  const closeFilterModal = useCallback(() => {
    setActiveFilterColumn(null)
    setError(null)
  }, [])

  const openFilterModal = useCallback((column: CrossFilterColumnConfig) => {
    setActiveFilterColumn(column)
    setError(null)
  }, [])

  const loadResumen = useCallback(
    async ({
      nextAnalysisColumns,
      nextFilters,
      nextPage,
      nextSearch
    }: {
      nextAnalysisColumns?: ICrossDynamicColumn[]
      nextFilters: ICrossColumnFilters
      nextPage: number
      nextSearch: string
    }) => {
      const requestId = latestRequestRef.current + 1
      latestRequestRef.current = requestId
      setIsLoading(true)

      const response = await getCrossResumenAction(cross.executionId, {
        page: nextPage,
        itemsPerPage: pagination.itemsPerPage,
        search: nextSearch,
        columnFilters: mapCrossColumnFiltersToResumenRequest(nextFilters)
      })

      if (requestId !== latestRequestRef.current) {
        return
      }

      if (!response.data) {
        setError(response.error ?? 'No fue posible cargar el resumen.')
        setIsLoading(false)
        return
      }

      const resolvedColumns =
        response.data.analysisSchema?.columns ??
        nextAnalysisColumns ??
        analysisColumns

      if (response.data.summaryBlocks) {
        setSummaryBlocks(mapSummaryBlocksToPreview(response.data.summaryBlocks))
      }

      setAnalysisColumns(resolvedColumns)
      setAnalysisRows(
        mapAnalysisRowsToPreview(response.data.analysis.rows, resolvedColumns)
      )
      setPagination({
        page: response.data.analysis.page,
        itemsPerPage: response.data.analysis.itemsPerPage,
        totalItems: response.data.analysis.totalItems,
        totalPages: response.data.analysis.totalPages
      })
      setError(null)
      setIsLoading(false)
    },
    [analysisColumns, cross.executionId, pagination.itemsPerPage]
  )

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value)
      void loadResumen({
        nextAnalysisColumns: analysisColumns,
        nextFilters: columnFilters,
        nextPage: 1,
        nextSearch: value
      })
    },
    [analysisColumns, columnFilters, loadResumen]
  )

  const setPage = useCallback(
    (page: number) => {
      void loadResumen({
        nextAnalysisColumns: analysisColumns,
        nextFilters: columnFilters,
        nextPage: page,
        nextSearch: search
      })
    },
    [analysisColumns, columnFilters, loadResumen, search]
  )

  const applyFilter = useCallback(
    (columnKey: ICrossFilterColumnKey, value: ICrossColumnFilterState) => {
      const nextFilters = {
        ...columnFilters,
        [columnKey]: value
      }

      setColumnFilters(nextFilters)
      void loadResumen({
        nextAnalysisColumns: analysisColumns,
        nextFilters,
        nextPage: 1,
        nextSearch: search
      })
      setActiveFilterColumn(null)
    },
    [analysisColumns, columnFilters, loadResumen, search]
  )

  const clearFilter = useCallback(
    (columnKey: ICrossFilterColumnKey) => {
      const nextFilters = { ...columnFilters }
      delete nextFilters[columnKey]

      setColumnFilters(nextFilters)
      void loadResumen({
        nextAnalysisColumns: analysisColumns,
        nextFilters,
        nextPage: 1,
        nextSearch: search
      })
    },
    [analysisColumns, columnFilters, loadResumen, search]
  )

  return {
    activeFilterColumn,
    analysisColumns,
    analysisRows,
    applyFilter,
    clearFilter,
    closeFilterModal,
    columnFilters,
    error,
    filterableColumns,
    isLoading,
    openFilterModal,
    pagination,
    search,
    setPage,
    setSearch,
    summaryBlocks
  }
}
