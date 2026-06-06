'use client'

import { useCallback, useMemo } from 'react'
import type { ICrossColumnFilters } from '../../../data/models/CrossManagement'
import type { CrossFilterColumnConfig } from './useCrossPreviewResumenQuery'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

interface UseCrossPreviewAnalysisHeaderCellParams {
  column: CrossFilterColumnConfig
  columnFilters: ICrossColumnFilters
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
}

export function useCrossPreviewAnalysisHeaderCell({
  column,
  columnFilters,
  onOpenFilterModal
}: UseCrossPreviewAnalysisHeaderCellParams) {
  const className = useMemo(
    () =>
      `${classes.columnFilterButton} ${
        columnFilters[column.key] ? classes.columnFilterButtonActive : ''
      }`,
    [column.key, columnFilters]
  )

  const handleOpenFilterModal = useCallback(() => {
    onOpenFilterModal(column)
  }, [column, onOpenFilterModal])

  return {
    className,
    handleOpenFilterModal
  }
}
