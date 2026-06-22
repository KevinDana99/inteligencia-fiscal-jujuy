import type {
  IBatchCreatedSummary,
  IBatchListData,
  IBatchLoadedCuitRow,
  IBatchManagementItem,
  IBatchManagementItems
} from '../../data/models/BatchManagement'
import { DEFAULT_BATCH_DETAIL_QUERY } from '../../constants'
import { formatBatchDateLabel } from './batchManagementFormatters'

export function mapBatchForPresentation(
  batch: IBatchManagementItem
): IBatchManagementItem {
  return {
    ...batch,
    createdAt: formatBatchDateLabel(batch.createdAt)
  }
}

export function getInitialBatches(initialBatchData?: IBatchListData | null) {
  return initialBatchData?.batches?.length
    ? initialBatchData.batches.map(mapBatchForPresentation)
    : []
}

export function applyBatchDetailToList(
  currentBatches: IBatchManagementItems,
  batchId: string,
  batchDetail: IBatchManagementItem
): IBatchManagementItems {
  return currentBatches.map((batch) =>
    batch.id === batchId ? mapBatchForPresentation(batchDetail) : batch
  )
}

export function mapBatchListDataForPresentation(batchListData: IBatchListData) {
  return {
    batches: batchListData.batches.map(mapBatchForPresentation),
    page: batchListData.page,
    itemsPerPage: batchListData.itemsPerPage,
    totalBatches: batchListData.totalItems,
    totalPages: batchListData.totalPages
  }
}

export function findCreatedBatch(
  refreshedBatches: IBatchManagementItems,
  createdSummary: IBatchCreatedSummary
) {
  return refreshedBatches.find(
    (batch) =>
      batch.name === createdSummary.name &&
      batch.batchNumber === createdSummary.formattedNumber
  )
}

export function buildFallbackCreatedBatch(
  createdSummary: IBatchCreatedSummary,
  parsedCuits: string[]
): IBatchManagementItem {
  const totalItems = createdSummary.cuitCount
  const totalPages = totalItems
    ? Math.ceil(totalItems / DEFAULT_BATCH_DETAIL_QUERY.itemsPerPage)
    : 0

  return {
    id: createdSummary.id,
    batchNumber: createdSummary.formattedNumber,
    name: createdSummary.name,
    description: createdSummary.description ?? '',
    regime: createdSummary.regime,
    cuitCount: createdSummary.cuitCount,
    cuitPage: DEFAULT_BATCH_DETAIL_QUERY.page,
    cuitItemsPerPage: DEFAULT_BATCH_DETAIL_QUERY.itemsPerPage,
    cuitTotalItems: totalItems,
    cuitTotalPages: totalPages,
    createdAt: formatBatchDateLabel(createdSummary.createdAt),
    createdBy: null,
    cuits: parsedCuits
      .slice(0, DEFAULT_BATCH_DETAIL_QUERY.itemsPerPage)
      .map((cuit, index) => ({
        id: `${createdSummary.id}-${index + 1}`,
        cuit: cuit.replace(/\D/g, ''),
        businessName: null,
        regime: createdSummary.regime,
        order: index + 1
      }))
  }
}

export function prependCreatedBatch(
  currentBatches: IBatchManagementItems,
  createdBatch: IBatchManagementItem
) {
  return [createdBatch, ...currentBatches]
}

export function getBatchListCountLabel(
  visibleBatchesCount: number,
  totalBatches: number
) {
  return `${visibleBatchesCount} de ${totalBatches} lotes`
}

export function getBatchListRangeLabel(
  page: number,
  itemsPerPage: number,
  visibleBatchesCount: number,
  totalBatches: number
) {
  if (totalBatches === 0 || visibleBatchesCount === 0) {
    return 'Mostrando 0 de 0 lotes'
  }

  const firstVisibleBatch = (page - 1) * itemsPerPage + 1
  const lastVisibleBatch = Math.min(
    firstVisibleBatch + visibleBatchesCount - 1,
    totalBatches
  )

  return `Mostrando ${firstVisibleBatch}-${lastVisibleBatch} de ${totalBatches} lotes`
}

export function getLoadedCuitsCountLabel(
  filteredLoadedCuitsCount: number,
  loadedCuitsCount: number,
  hasActiveFilter: boolean
) {
  if (hasActiveFilter) {
    return `${filteredLoadedCuitsCount} de ${loadedCuitsCount} CUITs cargados`
  }

  return `${loadedCuitsCount} CUITs cargados`
}

export function getCreatedBatchCuits(
  loadedCuits: IBatchLoadedCuitRow[]
) {
  return loadedCuits.map((row) => row.cuit)
}
