'use client'

import { useMemo } from 'react'
import type { ICrossDynamicColumn } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

export function useCrossPreviewPlanHeaderCell(column: ICrossDynamicColumn) {
  const className = useMemo(
    () =>
      `${classes.tableHeaderCell} ${
        isLeftAlignedPlanColumn(column.key) ? classes.planHeaderCellLeft : ''
      } ${isCenteredPlanColumn(column.key) ? classes.planHeaderCellCenter : ''}`,
    [column.key]
  )

  return { className }
}

export function useCrossPreviewPlanBodyCell(column: ICrossDynamicColumn) {
  const className = useMemo(
    () =>
      `${classes.tableBodyCell} ${
        column.key === 'idPeriodo' ? classes.planIdCell : ''
      } ${column.key === 'cuit' ? classes.planCuitCell : ''} ${
        column.key === 'razonSocial' ? classes.planBusinessNameCell : ''
      } ${isCenteredPlanColumn(column.key) ? classes.planCenteredCell : ''} ${
        isDangerPlanColumn(column.key) ? classes.planDangerCell : ''
      }`,
    [column.key]
  )

  return { className }
}

function isLeftAlignedPlanColumn(columnKey: string) {
  return columnKey === 'idPeriodo' || columnKey === 'cuit' || columnKey === 'razonSocial'
}

function isCenteredPlanColumn(columnKey: string) {
  return ['ano', 'origenDif', 'alicuota', 'coeficiente'].includes(columnKey)
}

function isDangerPlanColumn(columnKey: string) {
  return columnKey === 'difAFavorDpr'
}
