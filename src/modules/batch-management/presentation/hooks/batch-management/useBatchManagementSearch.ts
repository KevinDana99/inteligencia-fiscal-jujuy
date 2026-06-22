'use client'

import { useRef, useState, useTransition } from 'react'
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
  const [isSearchPending, startSearchTransition] = useTransition()
  const appliedSearchValueRef = useRef('')
  const latestSearchRequestIdRef = useRef(0)

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
    updateSearchValue,
    submitSearchValue,
    changePage,
    changeItemsPerPage
  }
}
