'use client'

import { useMemo } from 'react'
import type { ICrossManagementItems } from '../../../data/models/CrossManagement'
import { CROSS_MANAGEMENT_EMPTY_MESSAGE } from '../../constants/crossManagementLabels'
import { CROSS_MANAGEMENT_TABLE_COLUMNS } from '../../constants/crossManagementTable'

interface UseCrossManagementTableParams {
  items: ICrossManagementItems
}

export function useCrossManagementTable({ items }: UseCrossManagementTableParams) {
  const shouldShowEmptyState = items.length === 0
  const columns = useMemo(() => CROSS_MANAGEMENT_TABLE_COLUMNS, [])

  return {
    columns,
    emptyMessage: CROSS_MANAGEMENT_EMPTY_MESSAGE,
    shouldShowEmptyState
  }
}
