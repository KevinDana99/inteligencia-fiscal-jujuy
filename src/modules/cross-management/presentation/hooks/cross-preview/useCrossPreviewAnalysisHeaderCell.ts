'use client'

import { useCallback, useMemo } from 'react'
import type { ICrossColumnFilters } from '../../../data/models/CrossManagement'
import type { CrossPreviewAnalysisFilterColumn } from '../../constants/crossPreviewFilters'
import type { CrossFilterColumnConfig } from './useCrossPreviewAnalysisFilters'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

interface UseCrossPreviewAnalysisHeaderCellParams {
  column: CrossPreviewAnalysisFilterColumn
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
    onOpenFilterModal({ key: column.key, label: column.title })
  }, [column, onOpenFilterModal])

  return {
    className,
    handleOpenFilterModal
  }
}
