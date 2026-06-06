'use client'

import type {
  IReprocessingItem,
  IReprocessingItems
} from '../../data/models/Reprocessing'
import { findReprocessingItemById } from '../utils'

interface UseReprocessingRemoveTriggerParams {
  items: IReprocessingItems
  setPendingRemovalItem: (item: IReprocessingItem | null) => void
}

export function useReprocessingRemoveTrigger({
  items,
  setPendingRemovalItem
}: UseReprocessingRemoveTriggerParams) {
  const openRemoveModal = (itemId: string) => {
    const item = findReprocessingItemById(items, itemId)

    if (!item) {
      return
    }

    setPendingRemovalItem(item)
  }

  return {
    openRemoveModal
  }
}
