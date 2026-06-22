type GetBatchDetailCuitRangeParams = {
  page: number
  itemsPerPage: number
  visibleItems: number
  totalItems: number
}

export function getBatchDetailCuitRange({
  page,
  itemsPerPage,
  visibleItems,
  totalItems
}: GetBatchDetailCuitRangeParams) {
  const safeTotalItems = Math.max(0, totalItems)
  const safeVisibleItems = Math.max(0, visibleItems)
  const safeItemsPerPage = Math.max(1, itemsPerPage)
  const safePage = Math.max(1, page)
  const firstItemNumber =
    safeTotalItems && safeVisibleItems ? (safePage - 1) * safeItemsPerPage + 1 : 0
  const lastItemNumber =
    safeTotalItems && safeVisibleItems
      ? Math.min(firstItemNumber + safeVisibleItems - 1, safeTotalItems)
      : 0

  return {
    firstItemNumber,
    lastItemNumber,
    page: safePage,
    totalItems: safeTotalItems
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
