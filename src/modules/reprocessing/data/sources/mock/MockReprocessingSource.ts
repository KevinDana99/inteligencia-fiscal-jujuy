import type { IReprocessingSource } from '../../interfaces/ReprocessingSource'
import type {
  IReprocessingItems,
  IReprocessingListData,
  IReprocessingListParams,
  IReprocessingMarkedSummary,
  IReprocessingMarkPayload
} from '../../models/Reprocessing'
import { reprocessingItemsMock } from './fixtures/reprocessingItems'

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function cloneItems(items: IReprocessingItems): IReprocessingItems {
  return items.map((item) => ({ ...item }))
}

export class MockReprocessingSource implements IReprocessingSource {
  async listReprocessing(params: IReprocessingListParams = {}): Promise<IReprocessingListData> {
    const normalizedSearch = normalizeSearchValue(params.search ?? '')
    const requestedPage = Math.max(1, params.page ?? 1)
    const itemsPerPage = Math.max(1, params.itemsPerPage ?? 10)
    const activeItems = cloneItems(reprocessingItemsMock).filter(
      (item) => item.isReprocessing
    )

    const filteredItems = normalizedSearch
      ? activeItems.filter(
          (item) =>
            item.cuit.toLowerCase().includes(normalizedSearch) ||
            item.businessName.toLowerCase().includes(normalizedSearch)
        )
      : activeItems
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const page = totalPages ? Math.min(requestedPage, totalPages) : 1
    const startIndex = (page - 1) * itemsPerPage

    return {
      page,
      itemsPerPage,
      totalItems: filteredItems.length,
      totalPages,
      items: filteredItems.slice(startIndex, startIndex + itemsPerPage)
    }
  }

  async markReprocessing(
    payload: IReprocessingMarkPayload
  ): Promise<IReprocessingMarkedSummary> {
    return {
      id: `mock-${payload.contribuyenteId}`,
      contribuyenteId: payload.contribuyenteId,
      description: payload.description?.trim() || null,
      isActive: true,
      createdAtUtc: new Date().toISOString()
    }
  }

  async unmarkReprocessing(contribuyenteId: string): Promise<void> {
    const itemExists = reprocessingItemsMock.some(
      (item) => item.contribuyenteId === contribuyenteId
    )

    if (!itemExists) {
      throw new Error('Reprocessing item not found')
    }
  }
}
