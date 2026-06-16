'use client'

import { useRef, useState, useTransition } from 'react'
import { getReprocessingAction } from '../../data/actions'
import type { IReprocessingListData } from '../../data/models/Reprocessing'
import { normalizeReprocessingSearchValue } from '../utils'

const SEARCH_DEBOUNCE_MS = 500

interface UseReprocessingSearchParams {
  itemsPerPage: number
  onSearchResult: (data: IReprocessingListData) => void
}

export function useReprocessingSearch({
  itemsPerPage,
  onSearchResult
}: UseReprocessingSearchParams) {
  const [searchValue, setSearchValue] = useState('')
  const [isSearchPending, startSearchTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  const updateSearchValue = (value: string) => {
    setSearchValue(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    const normalizedValue = normalizeReprocessingSearchValue(value)

    const requestId = latestSearchRequestIdRef.current + 1
    latestSearchRequestIdRef.current = requestId

    searchTimeoutRef.current = setTimeout(() => {
      startSearchTransition(() => {
        void (async () => {
          const result = await getReprocessingAction({
            search: normalizedValue || null,
            page: 1,
            itemsPerPage
          })

          if (latestSearchRequestIdRef.current !== requestId || !result.data) {
            return
          }

          onSearchResult(result.data)
        })()
      })
    }, SEARCH_DEBOUNCE_MS)
  }

  return {
    searchValue,
    isSearchPending,
    setSearchValue: updateSearchValue
  }
}
