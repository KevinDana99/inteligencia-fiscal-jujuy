'use client'

import { useMemo } from 'react'

interface UseIntimationExportPaginationParams {
  currentPage: number
  totalPages: number
}

export function useIntimationExportPagination({
  currentPage,
  totalPages
}: UseIntimationExportPaginationParams) {
  return useMemo(
    () => ({
      isNextDisabled: currentPage >= totalPages,
      isPreviousDisabled: currentPage <= 1
    }),
    [currentPage, totalPages]
  )
}
