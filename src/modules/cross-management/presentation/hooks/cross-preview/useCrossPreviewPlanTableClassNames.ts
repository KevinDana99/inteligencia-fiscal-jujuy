'use client'

import { useMemo } from 'react'
import type { ICrossDynamicColumn } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

export function useCrossPreviewPlanHeaderCell(column: ICrossDynamicColumn) {
  const className = useMemo(
    () =>
      `${classes.tableHeaderCell} ${
        column.key === 'cuit' || column.key === 'razonSocial'
          ? classes.planNeutralHeaderCell
          : ''
      }`,
    [column.key]
  )

  return { className }
}

export function useCrossPreviewPlanBodyCell(column: ICrossDynamicColumn) {
  const className = useMemo(
    () =>
      `${classes.tableBodyCell} ${
        column.key === 'cuit' ? classes.planCuitCell : ''
      } ${
        column.key === 'razonSocial' ? classes.planBusinessNameCell : ''
      }`,
    [column.key]
  )

  return { className }
}
