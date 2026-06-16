'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCrossManagementAction } from '../../../data/actions'
import {
  CROSS_MANAGEMENT_POLLING_INTERVAL_MS,
  DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
  DEFAULT_CROSS_MANAGEMENT_PAGE
} from '../../../constants/crossManagementRequest'
import type { ICrossManagementListData } from '../../../data/models/CrossManagement'

export function useCrossManagementPolling(
  initialCrossData?: ICrossManagementListData | null
) {
  const [crossData, setCrossData] = useState<ICrossManagementListData | null>(
    initialCrossData ?? null
  )
  const [pollingError, setPollingError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const isPollingRef = useRef(false)
  const latestRequestIdRef = useRef(0)

  const refreshCrossData = useCallback(async () => {
    if (isPollingRef.current) {
      return
    }

    isPollingRef.current = true
    const requestId = latestRequestIdRef.current + 1
    latestRequestIdRef.current = requestId

    try {
      const result = await getCrossManagementAction({
        itemsPerPage: DEFAULT_CROSS_MANAGEMENT_ITEMS_PER_PAGE,
        page: DEFAULT_CROSS_MANAGEMENT_PAGE
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
      isPollingRef.current = false
    }
  }, [])

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

  return {
    crossData,
    pollingError,
    refreshCrossData
  }
}
