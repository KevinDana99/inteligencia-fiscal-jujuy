'use client'

import { useRef, useState, useTransition } from 'react'
import { getReprocessingAction } from '../../data/actions'
import type {
  IReprocessingItems,
  IReprocessingListData
} from '../../data/models/Reprocessing'
import {
  getInitialReprocessingItems,
  normalizeReprocessingSearchValue
} from '../utils'

const SEARCH_DEBOUNCE_MS = 500
const MIN_SEARCH_LENGTH = 3

interface UseReprocessingSearchParams {
  initialData?: IReprocessingListData | null
  items: IReprocessingItems
  total: number
  setItems: React.Dispatch<React.SetStateAction<IReprocessingItems>>
  setTotal: React.Dispatch<React.SetStateAction<number>>
}

export function useReprocessingSearch({
  initialData,
  items,
  total,
  setItems,
  setTotal
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

    if (normalizedValue.length > 0 && normalizedValue.length < MIN_SEARCH_LENGTH) {
      setItems(getInitialReprocessingItems(initialData))
      setTotal(initialData?.totalItems ?? 0)
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      startSearchTransition(() => {
        void (async () => {
          const result = await getReprocessingAction({
            search: normalizedValue || null
          })

          if (latestSearchRequestIdRef.current !== requestId || !result.data) {
            return
          }

          setItems(result.data.items)
          setTotal(result.data.totalItems)
        })()
      })
    }, SEARCH_DEBOUNCE_MS)
  }

  return {
    items,
    total,
    searchValue,
    isSearchPending,
    setSearchValue: updateSearchValue
  }
}
