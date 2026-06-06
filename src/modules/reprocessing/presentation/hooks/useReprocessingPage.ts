'use client'

import { useState } from 'react'
import type {
  IReprocessingItem,
  IReprocessingItems,
  IReprocessingListData,
} from '../../data/models/Reprocessing'
import {
  getInitialReprocessingItems,
  removeReprocessingItem
} from '../utils'

export function useReprocessingPage(initialData?: IReprocessingListData | null) {
  const [items, setItems] = useState<IReprocessingItems>(
    getInitialReprocessingItems(initialData)
  )
  const [total, setTotal] = useState(initialData?.totalItems ?? 0)
  const [pendingRemovalItem, setPendingRemovalItem] = useState<IReprocessingItem | null>(null)

  const removeItem = (itemId: string) => {
    setItems((current) => removeReprocessingItem(current, itemId))
    setTotal((current) => Math.max(0, current - 1))
  }

  return {
    initialData,
    items,
    total,
    pendingRemovalItem,
    setItems,
    setTotal,
    setPendingRemovalItem,
    removeItem
  }
}
