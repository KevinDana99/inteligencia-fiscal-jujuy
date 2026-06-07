import type {
  IBatchCreatedSummary,
  IBatchListData,
  IBatchLoadedCuitRow,
  IBatchManagementItem,
  IBatchManagementItems
} from '../../data/models/BatchManagement'
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
) {
  return currentBatches.map((batch) =>
    batch.id === batchId ? mapBatchForPresentation(batchDetail) : batch
  )
}

export function mapBatchListDataForPresentation(batchListData: IBatchListData) {
  return {
    batches: batchListData.batches.map(mapBatchForPresentation),
    totalBatches: batchListData.totalItems
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
  return {
    id: createdSummary.id,
    batchNumber: createdSummary.formattedNumber,
    name: createdSummary.name,
    description: createdSummary.description ?? '',
    regime: createdSummary.regime,
    cuitCount: createdSummary.cuitCount,
    createdAt: formatBatchDateLabel(createdSummary.createdAt),
    createdBy: null,
    cuits: parsedCuits.map((cuit, index) => ({
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
