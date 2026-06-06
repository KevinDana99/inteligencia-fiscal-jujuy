'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { getBatchManagementAction } from '../../../data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from '../../../constants'
import type { IBatchListData } from '../../../data/models/BatchManagement'
import { BATCH_MANAGEMENT_SEARCH_DEBOUNCE_MS } from '../../constants'

type UseBatchManagementSearchParams = {
  onBatchListDataChange: (batchListData: IBatchListData) => void
}

export function useBatchManagementSearch({
  onBatchListDataChange
}: UseBatchManagementSearchParams) {
  const [searchValue, setSearchValue] = useState('')
  const [isSearchPending, startSearchTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  function updateSearchValue(value: string) {
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
            ...DEFAULT_BATCH_MANAGEMENT_LIST_QUERY,
            search: value.trim() || null
          })

          if (latestSearchRequestIdRef.current !== requestId || !result.data) {
            return
          }

          onBatchListDataChange(result.data)
        })()
      })
    }, BATCH_MANAGEMENT_SEARCH_DEBOUNCE_MS)
  }

  return {
    searchValue,
    isSearchPending,
    updateSearchValue
  }
}
