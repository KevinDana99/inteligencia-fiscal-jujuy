'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCrossManagementAction } from '../../../data/actions'
import {
  CROSS_MANAGEMENT_POLLING_INTERVAL_MS,
  CROSS_MANAGEMENT_SEARCH_DEBOUNCE_MS,
  DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
  DEFAULT_CROSS_MANAGEMENT_PAGE
} from '../../../constants/crossManagementRequest'
import type { ICrossManagementListData } from '../../../data/models/CrossManagement'

interface UseCrossManagementPollingParams {
  initialCrossData?: ICrossManagementListData | null
  searchValue: string
}

interface RefreshCrossDataOptions {
  force?: boolean
  search?: string
}

export function useCrossManagementPolling({
  initialCrossData,
  searchValue
}: UseCrossManagementPollingParams) {
  const [crossData, setCrossData] = useState<ICrossManagementListData | null>(
    initialCrossData ?? null
  )
  const [pollingError, setPollingError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const isPollingRef = useRef(false)
  const isInitialSearchEffectRef = useRef(true)
  const latestRequestIdRef = useRef(0)
  const normalizedSearchValue = searchValue.trim()

  const refreshCrossData = useCallback(
    async (options: RefreshCrossDataOptions = {}) => {
      if (isPollingRef.current && !options.force) {
        return
      }

      isPollingRef.current = true
      const requestId = latestRequestIdRef.current + 1
      latestRequestIdRef.current = requestId
      const search = options.search ?? normalizedSearchValue

      try {
        const result = await getCrossManagementAction({
          itemsPerPage: DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
          page: DEFAULT_CROSS_MANAGEMENT_PAGE,
          search: search || null
        })

        if (!isMountedRef.current || latestRequestIdRef.current !== requestId) {
          return
        }

        if (result.data) {
          setCrossData(result.data)
          setPollingError(null)
          return
        }

        setPollingError(
          result.error ?? 'No fue posible actualizar las ejecuciones de cruces.'
        )
      } finally {
        if (latestRequestIdRef.current === requestId) {
          isPollingRef.current = false
        }
      }
    },
    [normalizedSearchValue]
  )

  useEffect(() => {
    isMountedRef.current = true

    const intervalId = setInterval(() => {
      void refreshCrossData()
    }, CROSS_MANAGEMENT_POLLING_INTERVAL_MS)

    return () => {
      isMountedRef.current = false
      latestRequestIdRef.current += 1
      clearInterval(intervalId)
    }
  }, [refreshCrossData])

  useEffect(() => {
    if (isInitialSearchEffectRef.current) {
      isInitialSearchEffectRef.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      void refreshCrossData({
        force: true,
        search: normalizedSearchValue
      })
    }, CROSS_MANAGEMENT_SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [normalizedSearchValue, refreshCrossData])

  return {
    crossData,
    pollingError,
    refreshCrossData
  }
}
