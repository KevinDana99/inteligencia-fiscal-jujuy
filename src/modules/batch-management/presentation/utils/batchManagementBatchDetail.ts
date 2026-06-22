import type { IBatchManagementCuit } from '../../data/models/BatchManagement'

type GetBatchDetailCuitPageParams = {
  cuits: IBatchManagementCuit[]
  page: number
  itemsPerPage: number
}

export function getBatchDetailCuitPage({
  cuits,
  page,
  itemsPerPage
}: GetBatchDetailCuitPageParams) {
  const totalItems = cuits.length
  const safeItemsPerPage = Math.max(1, itemsPerPage)
  const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const firstItemIndex = totalItems ? (safePage - 1) * safeItemsPerPage : 0
  const visibleCuits = cuits.slice(firstItemIndex, firstItemIndex + safeItemsPerPage)
  const firstItemNumber = totalItems ? firstItemIndex + 1 : 0
  const lastItemNumber = totalItems ? firstItemIndex + visibleCuits.length : 0

  return {
    cuits: visibleCuits,
    firstItemNumber,
    lastItemNumber,
    page: safePage,
    totalItems,
    totalPages
  }
}

export function getBatchDetailCuitRangeLabel(
  firstItemNumber: number,
  lastItemNumber: number,
  totalItems: number
) {
  if (!totalItems) {
    return 'Mostrando 0 de 0 CUITs'
  }

  return `Mostrando ${firstItemNumber}-${lastItemNumber} de ${totalItems} CUITs`
}
