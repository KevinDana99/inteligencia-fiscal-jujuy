'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { getCrossPlanillaAction } from '../../../data/actions'
import {
  mapPlanillaRowsToPreview
} from '../../../data/mappers/mapCrossPreviewContractToView'
import type {
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewData,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'

interface UseCrossPreviewPlanillaQueryParams {
  cross: ICrossPreviewData
}

export function useCrossPreviewPlanillaQuery({
  cross
}: UseCrossPreviewPlanillaQueryParams) {
  const latestRequestRef = useRef(0)
  const hasPlanilla = cross.viewsAvailable.includes('planilla')
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
      nextPage,
      nextSearch
    }: {
      nextColumns?: ICrossDynamicColumn[]
      nextPage: number
      nextSearch: string
    }) => {
      if (!hasPlanilla) {
        return
      }

      const requestId = latestRequestRef.current + 1
      latestRequestRef.current = requestId
      setIsLoading(true)

      const response = await getCrossPlanillaAction(cross.executionId, {
        page: nextPage,
        itemsPerPage: pagination.itemsPerPage,
        search: nextSearch
      })

      if (requestId !== latestRequestRef.current) {
        return
      }

      if (!response.data) {
        setError(response.error ?? 'No fue posible cargar la planilla.')
        setIsLoading(false)
        return
      }

      const planillaData = response.data
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
    [columns, cross.executionId, hasPlanilla, pagination.itemsPerPage]
  )

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value)
      void loadPlanilla({
        nextColumns: columns,
        nextPage: 1,
        nextSearch: value
      })
    },
    [columns, loadPlanilla]
  )

  const setPage = useCallback(
    (page: number) => {
      void loadPlanilla({
        nextColumns: columns,
        nextPage: page,
        nextSearch: search
      })
    },
    [columns, loadPlanilla, search]
  )

  const visiblePagination = useMemo(
    () => pagination,
    [pagination]
  )

  return {
    columns,
    error,
    isLoading,
    pagination: visiblePagination,
    rows,
    search,
    setPage,
    setSearch
  }
}
