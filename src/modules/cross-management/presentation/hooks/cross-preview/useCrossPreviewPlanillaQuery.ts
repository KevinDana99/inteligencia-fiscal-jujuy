'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { getCrossResultsAction } from '../../../data/actions'
import {
  mapCrossResultsToPlanillaData,
  mapPlanillaRowsToPreview
} from '../../../data/mappers/mapCrossPreviewContractToView'
import type {
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewData,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { matchesCrossSearch } from '../../../data/utils/crossSearch'

interface UseCrossPreviewPlanillaQueryParams {
  cross: ICrossPreviewData
}

export function useCrossPreviewPlanillaQuery({
  cross
}: UseCrossPreviewPlanillaQueryParams) {
  const latestRequestRef = useRef(0)
  const [columns, setColumns] = useState<ICrossDynamicColumn[]>(cross.planColumns)
  const [rows, setRows] = useState<ICrossPreviewPlanRow[]>(cross.planRows)
  const [pagination, setPagination] = useState<ICrossPaginationData>(
    cross.planPagination
  )
  const [search, setSearchState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPlanilla = useCallback(
    async ({
      nextColumns,
      nextPage
    }: {
      nextColumns?: ICrossDynamicColumn[]
      nextPage: number
    }) => {
      const requestId = latestRequestRef.current + 1
      latestRequestRef.current = requestId
      setIsLoading(true)

      const response = await getCrossResultsAction(cross.executionId, {
        page: nextPage,
        itemsPerPage: pagination.itemsPerPage
      })

      if (requestId !== latestRequestRef.current) {
        return
      }

      if (!response.data) {
        setError(response.error ?? 'No fue posible cargar la planilla.')
        setIsLoading(false)
        return
      }

      const planillaData = mapCrossResultsToPlanillaData(response.data)
      const resolvedColumns =
        planillaData.schema?.columns ?? nextColumns ?? columns

      if (requestId !== latestRequestRef.current) {
        return
      }

      setColumns(resolvedColumns)
      setRows(mapPlanillaRowsToPreview(planillaData.rows, resolvedColumns))
      setPagination({
        page: planillaData.page,
        itemsPerPage: planillaData.itemsPerPage,
        totalItems: planillaData.totalItems,
        totalPages: planillaData.totalPages
      })
      setError(null)
      setIsLoading(false)
    },
    [columns, cross.executionId, pagination.itemsPerPage]
  )

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value)
    },
    []
  )

  const setPage = useCallback(
    (page: number) => {
      void loadPlanilla({
        nextColumns: columns,
        nextPage: page
      })
    },
    [columns, loadPlanilla]
  )

  const visibleRows = useMemo(
    () =>
      rows.filter((row) =>
        matchesCrossSearch([row.cuit, row.businessName], search)
      ),
    [rows, search]
  )
  const visiblePagination = useMemo(
    () =>
      search
        ? {
            ...pagination,
            page: 1,
            totalItems: visibleRows.length,
            totalPages: 1
          }
        : pagination,
    [pagination, search, visibleRows.length]
  )

  return {
    columns,
    error,
    isLoading,
    pagination: visiblePagination,
    rows: visibleRows,
    search,
    setPage,
    setSearch
  }
}
