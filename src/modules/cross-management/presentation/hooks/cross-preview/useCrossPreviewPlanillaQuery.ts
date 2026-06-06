'use client'

import { useCallback, useRef, useState } from 'react'
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

      const resolvedColumns =
        response.data.schema?.columns ?? nextColumns ?? columns

      setColumns(resolvedColumns)
      setRows(mapPlanillaRowsToPreview(response.data.rows, resolvedColumns))
      setPagination({
        page: response.data.page,
        itemsPerPage: response.data.itemsPerPage,
        totalItems: response.data.totalItems,
        totalPages: response.data.totalPages
      })
      setError(null)
      setIsLoading(false)
    },
    [columns, cross.executionId, pagination.itemsPerPage]
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

  return {
    columns,
    error,
    isLoading,
    pagination,
    rows,
    search,
    setPage,
    setSearch
  }
}
