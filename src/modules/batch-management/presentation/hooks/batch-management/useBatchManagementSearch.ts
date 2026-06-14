'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { getBatchManagementAction } from '../../../data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from '../../../constants'
import type { IBatchListData } from '../../../data/models/BatchManagement'
import { BATCH_MANAGEMENT_SEARCH_DEBOUNCE_MS } from '../../constants'

type UseBatchManagementSearchParams = {
  itemsPerPage: number
  onBatchListDataChange: (batchListData: IBatchListData) => void
}

export function useBatchManagementSearch({
  itemsPerPage,
  onBatchListDataChange
}: UseBatchManagementSearchParams) {
  const [searchValue, setSearchValue] = useState('')
  const [isSearchPending, startSearchTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  function clearSearchTimeout() {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }

  function requestBatchListData(params: {
    page: number
    itemsPerPage: number
    search: string
  }) {
    const requestId = latestSearchRequestIdRef.current + 1
    latestSearchRequestIdRef.current = requestId

    startSearchTransition(() => {
      void (async () => {
        const result = await getBatchManagementAction({
          ...DEFAULT_BATCH_MANAGEMENT_LIST_QUERY,
          page: params.page,
          itemsPerPage: params.itemsPerPage,
          search: params.search.trim() || null
        })

        if (latestSearchRequestIdRef.current !== requestId || !result.data) {
          return
        }

        onBatchListDataChange(result.data)
      })()
    })
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  function updateSearchValue(value: string) {
    setSearchValue(value)
    clearSearchTimeout()

    searchTimeoutRef.current = setTimeout(() => {
      requestBatchListData({
        page: 1,
        itemsPerPage,
        search: value
      })
    }, BATCH_MANAGEMENT_SEARCH_DEBOUNCE_MS)
  }

  function changePage(page: number) {
    clearSearchTimeout()
    requestBatchListData({
      page,
      itemsPerPage,
      search: searchValue
    })
  }

  function changeItemsPerPage(nextItemsPerPage: number) {
    clearSearchTimeout()
    requestBatchListData({
      page: 1,
      itemsPerPage: nextItemsPerPage,
      search: searchValue
    })
  }

  return {
    searchValue,
    isSearchPending,
    updateSearchValue,
    changePage,
    changeItemsPerPage
  }
}
