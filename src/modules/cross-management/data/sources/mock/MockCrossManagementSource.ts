import type { ICrossManagementSource } from '../../interfaces/CrossManagementSource'
import type {
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../../models/CrossManagement'
import { crossItemsMock, crossPreviewMockById } from './fixtures/crossItems'

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

export class MockCrossManagementSource implements ICrossManagementSource {
  async listExecutions(
    params: ICrossManagementListParams = {}
  ): Promise<ICrossManagementListData> {
    const normalizedSearch = normalizeSearchValue(params.search ?? '')
    const items = normalizedSearch
      ? crossItemsMock.filter(
          (item) =>
            item.name.toLowerCase().includes(normalizedSearch) ||
            item.sourceRef.toLowerCase().includes(normalizedSearch)
        )
      : crossItemsMock

    return {
      page: params.page ?? 1,
      itemsPerPage: params.itemsPerPage ?? 20,
      totalItems: items.length,
      totalPages: 1,
      items
    }
  }

  async listResults(
    executionId: number,
    params: ICrossResultsListParams = {}
  ): Promise<ICrossResultsListData> {
    const preview =
      crossPreviewMockById[String(executionId)] ??
      crossPreviewMockById[`cross-${executionId}`]
    const results =
      preview?.analysisRows.map((row, index) => ({
        id: `${executionId}-${index + 1}`,
        executionId,
        crossCode: preview.id,
        crossVersion: 'mock',
        taxpayerId: '',
        cuit: row.cuit,
        granularity: 'anual',
        period: preview.period,
        periodFrom: preview.period,
        periodTo: preview.period,
        calculationStatus: row.status,
        metrics: {},
        dynamicDetail: {},
        sources: [],
        nonCalculableFields: [],
        createdAt: preview.date
      })) ?? []

    return {
      page: params.page ?? 1,
      itemsPerPage: params.itemsPerPage ?? 20,
      totalItems: results.length,
      totalPages: 1,
      results
    }
  }
}
