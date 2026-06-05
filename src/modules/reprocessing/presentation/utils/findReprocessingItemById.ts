import type {
  IReprocessingItem,
  IReprocessingItems
} from '../../data/models/Reprocessing'

export function findReprocessingItemById(
  items: IReprocessingItems,
  itemId: string
): IReprocessingItem | null {
  return items.find((currentItem) => currentItem.id === itemId) ?? null
}
