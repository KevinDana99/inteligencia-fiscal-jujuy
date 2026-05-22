'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  getReprocessingAction,
  unmarkReprocessingAction
} from '../../data/actions'
import type {
  IReprocessingItem,
  IReprocessingItems,
  IReprocessingListData
} from '../../data/models/Reprocessing'

const SEARCH_DEBOUNCE_MS = 500
const MIN_SEARCH_LENGTH = 3

function getInitialItems(initialData?: IReprocessingListData | null): IReprocessingItems {
  return initialData?.items ?? []
}

export function useReprocessing(initialData?: IReprocessingListData | null) {
  const router = useRouter()
  const [items, setItems] = useState<IReprocessingItems>(getInitialItems(initialData))
  const [total, setTotal] = useState(initialData?.totalItems ?? 0)
  const [searchValue, setSearchValue] = useState('')
  const [pendingRemovalItem, setPendingRemovalItem] = useState<IReprocessingItem | null>(null)
  const [isSearchPending, startSearchTransition] = useTransition()
  const [isRemovePending, startRemoveTransition] = useTransition()
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRequestIdRef = useRef(0)

  const filteredItems = useMemo(() => items, [items])

  const openInPadron = (cuit: string) => {
    router.push(`/?cuit=${encodeURIComponent(cuit)}`)
  }

  const updateSearchValue = (value: string) => {
    setSearchValue(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    const normalizedValue = value.trim()

    const requestId = latestSearchRequestIdRef.current + 1
    latestSearchRequestIdRef.current = requestId

    if (normalizedValue.length > 0 && normalizedValue.length < MIN_SEARCH_LENGTH) {
      setItems(getInitialItems(initialData))
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

  const openRemoveModal = (itemId: string) => {
    const item = items.find((currentItem) => currentItem.id === itemId)

    if (!item) {
      return
    }

    setPendingRemovalItem(item)
  }

  const closeRemoveModal = () => {
    setPendingRemovalItem(null)
  }

  const confirmRemoveFromReprocessing = () => {
    if (!pendingRemovalItem) {
      return
    }

    startRemoveTransition(() => {
      void (async () => {
        const result = await unmarkReprocessingAction(pendingRemovalItem.contribuyenteId)

        if (!result.success) {
          return
        }

        setItems((current) =>
          current.filter((item) => item.id !== pendingRemovalItem.id)
        )
        setTotal((current) => Math.max(0, current - 1))
        setPendingRemovalItem(null)
      })()
    })
  }

  return {
    items: filteredItems,
    total,
    searchValue,
    pendingRemovalItem,
    isSearchPending,
    isRemovePending,
    setSearchValue: updateSearchValue,
    openInPadron,
    openRemoveModal,
    closeRemoveModal,
    confirmRemoveFromReprocessing
  }
}
