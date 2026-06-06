import type { IReprocessingItems } from '../../data/models/Reprocessing'

export function removeReprocessingItem(
  items: IReprocessingItems,
  itemId: string
): IReprocessingItems {
  return items.filter((item) => item.id !== itemId)
}
