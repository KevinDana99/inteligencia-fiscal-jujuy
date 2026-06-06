'use client'

import { useCallback, useMemo } from 'react'
import type { ICrossManagementItem } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossManagementTable/CrossManagementTableRow.module.css'

interface UseCrossManagementTableRowParams {
  item: ICrossManagementItem
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

export function useCrossManagementTableRow({
  item,
  onOpenCrossPreview
}: UseCrossManagementTableRowParams) {
  const sourceBadgeClassName = useMemo(
    () =>
      item.source === 'Lote'
        ? classes.sourceBadgeLote
        : classes.sourceBadgePadron,
    [item.source]
  )

  const handleOpenCrossPreview = useCallback(() => {
    onOpenCrossPreview(item)
  }, [item, onOpenCrossPreview])

  return {
    handleOpenCrossPreview,
    sourceBadgeClassName
  }
}
