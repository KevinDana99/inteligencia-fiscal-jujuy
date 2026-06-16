'use client'

import { useState, useTransition } from 'react'
import { getReprocessingAction } from '../../data/actions'
import type {
  IReprocessingItem,
  IReprocessingItems,
  IReprocessingListData,
} from '../../data/models/Reprocessing'
import {
  getInitialReprocessingItems,
  normalizeReprocessingSearchValue,
  removeReprocessingItem
} from '../utils'
import { useReprocessingSearch } from './useReprocessingSearch'

export function useReprocessingPage(initialData?: IReprocessingListData | null) {
  const [items, setItems] = useState<IReprocessingItems>(
    getInitialReprocessingItems(initialData)
  )
  const [total, setTotal] = useState(initialData?.totalItems ?? 0)
  const [currentPage, setCurrentPage] = useState(initialData?.page ?? 1)
  const [itemsPerPage, setItemsPerPage] = useState(initialData?.itemsPerPage ?? 10)
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 0)
  const [isPagePending, startPageTransition] = useTransition()
  const [pendingRemovalItem, setPendingRemovalItem] = useState<IReprocessingItem | null>(null)

  const applyPageData = (data: IReprocessingListData) => {
    setItems(data.items)
    setTotal(data.totalItems)
    setCurrentPage(data.page)
    setItemsPerPage(data.itemsPerPage)
    setTotalPages(data.totalPages)
  }

  const {
    searchValue,
    isSearchPending,
    setSearchValue
  } = useReprocessingSearch({
    itemsPerPage,
    onSearchResult: applyPageData
  })

  const goToPage = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return
    }

    const normalizedSearch = normalizeReprocessingSearchValue(searchValue)
    const search = normalizedSearch.length >= 3 ? normalizedSearch : null

    startPageTransition(() => {
      void (async () => {
        const result = await getReprocessingAction({
          page,
          itemsPerPage,
          search
        })

        if (!result.data) {
          return
        }

        applyPageData(result.data)
      })()
    })
  }

  const removeItem = (itemId: string) => {
    setItems((current) => removeReprocessingItem(current, itemId))
    setTotal((current) => {
      const nextTotal = Math.max(0, current - 1)
      const nextTotalPages = Math.ceil(nextTotal / itemsPerPage)

      setTotalPages(nextTotalPages)
      setCurrentPage((page) => Math.min(page, Math.max(1, nextTotalPages)))

      return nextTotal
    })
  }

  return {
    initialData,
    items,
    total,
    currentPage,
    itemsPerPage,
    totalPages,
    searchValue,
    isSearchPending,
    isPagePending,
    pendingRemovalItem,
    setSearchValue,
    setPendingRemovalItem,
    goToPage,
    removeItem
  }
}
