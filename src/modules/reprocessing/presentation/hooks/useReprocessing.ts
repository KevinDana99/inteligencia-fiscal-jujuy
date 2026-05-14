'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { IReprocessingItems } from '../../data/models/Reprocessing'
import { reprocessingItemsMock } from '../../data/sources/mock/fixtures/reprocessingItems'

export function useReprocessing() {
  const router = useRouter()
  const [items, setItems] = useState<IReprocessingItems>(reprocessingItemsMock)
  const [searchValue, setSearchValue] = useState('')

  const activeItems = useMemo(
    () => items.filter((item) => item.isReprocessing),
    [items]
  )

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return activeItems
    }

    return activeItems.filter(
      (item) =>
        item.cuit.toLowerCase().includes(normalizedSearch) ||
        item.businessName.toLowerCase().includes(normalizedSearch)
    )
  }, [activeItems, searchValue])

  const openInPadron = (cuit: string) => {
    router.push(`/?cuit=${encodeURIComponent(cuit)}`)
  }

  const removeFromReprocessing = (itemId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, isReprocessing: false } : item
      )
    )
  }

  return {
    items: filteredItems,
    total: activeItems.length,
    searchValue,
    setSearchValue,
    openInPadron,
    removeFromReprocessing
  }
}
