'use client'

import { useRef, useState } from 'react'
import { getBatchManagementAction } from '../../../data/actions'
import { DEFAULT_BATCH_MANAGEMENT_LIST_QUERY } from '../../../constants'
import type { IBatchListData } from '../../../data/models/BatchManagement'

type UseBatchManagementSearchParams = {
  itemsPerPage: number
  onBatchListDataChange: (batchListData: IBatchListData) => void
}

export function useBatchManagementSearch({
  itemsPerPage,
  onBatchListDataChange
}: UseBatchManagementSearchParams) {
  const [searchValue, setSearchValue] = useState('')
  const [isSearchPending, setIsSearchPending] = useState(false)
  const [pendingPage, setPendingPage] = useState<number | null>(null)
  const [pendingItemsPerPage, setPendingItemsPerPage] = useState<number | null>(null)
  const appliedSearchValueRef = useRef('')
  const latestSearchRequestIdRef = useRef(0)

  function requestBatchListData(params: {
    page: number
    itemsPerPage: number
    search: string
  }) {
    const requestId = latestSearchRequestIdRef.current + 1
    latestSearchRequestIdRef.current = requestId
    setIsSearchPending(true)
    setPendingPage(params.page)
    setPendingItemsPerPage(params.itemsPerPage)

    void (async () => {
      try {
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
      } finally {
        if (latestSearchRequestIdRef.current === requestId) {
          setIsSearchPending(false)
          setPendingPage(null)
          setPendingItemsPerPage(null)
        }
      }
    })()
  }

  function updateSearchValue(value: string) {
    setSearchValue(value)
  }

  function submitSearchValue() {
    const nextSearchValue = searchValue.trim()

    if (nextSearchValue === appliedSearchValueRef.current) {
      return
    }

    appliedSearchValueRef.current = nextSearchValue
    requestBatchListData({
      page: 1,
      itemsPerPage,
      search: nextSearchValue
    })
  }

  function changePage(page: number) {
    requestBatchListData({
      page,
      itemsPerPage,
      search: appliedSearchValueRef.current
    })
  }

  function changeItemsPerPage(nextItemsPerPage: number) {
    requestBatchListData({
      page: 1,
      itemsPerPage: nextItemsPerPage,
      search: appliedSearchValueRef.current
    })
  }

  return {
    searchValue,
    isSearchPending,
    pendingPage,
    pendingItemsPerPage,
    updateSearchValue,
    submitSearchValue,
    changePage,
    changeItemsPerPage
  }
}
