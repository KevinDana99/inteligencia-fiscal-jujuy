'use client'

import { useMemo } from 'react'
import {
  CROSS_PREVIEW_PLAN_BI_COLUMNS,
  CROSS_PREVIEW_PLAN_CM_COLUMNS,
  CROSS_PREVIEW_PLAN_COEF_COLUMNS,
  CROSS_PREVIEW_PLAN_DIFF_COLUMNS,
  CROSS_PREVIEW_PLAN_ESTIMATED_COLUMNS,
  CROSS_PREVIEW_PLAN_FINAL_COLUMN,
  CROSS_PREVIEW_PLAN_TAX_COLUMNS
} from '../../constants/crossPreviewPlanTable'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

type CrossPreviewPlanGroupClassName =
  | 'neutral'
  | 'bi'
  | 'cm'
  | 'diff'
  | 'coef'
  | 'estimated'
  | 'tax'
  | 'final'

interface UseCrossPreviewPlanGroupHeaderCellParams {
  groupClassName: CrossPreviewPlanGroupClassName
}

export function useCrossPreviewPlanGroupHeaderCell({
  groupClassName
}: UseCrossPreviewPlanGroupHeaderCellParams) {
  const className = useMemo(
    () =>
      `${classes.planGroupHeaderCell} ${
        {
          neutral: classes.planGroupNeutralHeaderCell,
          bi: classes.planGroupBiHeaderCell,
          cm: classes.planGroupCmHeaderCell,
          diff: classes.planGroupDiffHeaderCell,
          coef: classes.planGroupCoefHeaderCell,
          estimated: classes.planGroupEstimatedHeaderCell,
          tax: classes.planGroupTaxHeaderCell,
          final: classes.planGroupFinalHeaderCell
        }[groupClassName]
      }`,
    [groupClassName]
  )

  return { className }
}

export function useCrossPreviewPlanHeaderCell(column: string) {
  const className = useMemo(
    () =>
      `${classes.tableHeaderCell} ${
        CROSS_PREVIEW_PLAN_BI_COLUMNS.includes(column)
          ? classes.planBiHeaderCell
          : CROSS_PREVIEW_PLAN_CM_COLUMNS.includes(column)
            ? classes.planCmHeaderCell
            : CROSS_PREVIEW_PLAN_DIFF_COLUMNS.includes(column)
              ? classes.planDiffHeaderCell
              : CROSS_PREVIEW_PLAN_COEF_COLUMNS.includes(column)
                ? classes.planCoefHeaderCell
                : CROSS_PREVIEW_PLAN_ESTIMATED_COLUMNS.includes(column)
                  ? classes.planEstimatedHeaderCell
                  : CROSS_PREVIEW_PLAN_TAX_COLUMNS.includes(column)
                    ? classes.planTaxHeaderCell
                    : column === CROSS_PREVIEW_PLAN_FINAL_COLUMN
                      ? classes.planFinalHeaderCell
                      : ''
      }`,
    [column]
  )

  return { className }
}

export function useCrossPreviewPlanBodyCell(index: number) {
  const className = useMemo(
    () =>
      `${classes.tableBodyCell} ${
        index === 0 || index === 1 ? classes.planIdCell : ''
      } ${index === 2 ? classes.planCuitCell : ''} ${
        index === 3 ? classes.planBusinessNameCell : ''
      } ${index >= 4 && index <= 10 ? classes.planBiBodyCell : ''} ${
        index === 11 || (index >= 15 && index <= 19)
          ? classes.planCmBodyCell
          : ''
      } ${index >= 12 && index <= 14 ? classes.planDiffBodyCell : ''} ${
        index === 12 ? classes.planDiffValueCell : ''
      } ${index === 13 || index === 14 ? classes.planDiffMetaCell : ''} ${
        (index >= 20 && index <= 22) || index === 28 || index === 29
          ? classes.planCoefBodyCell
          : ''
      } ${index >= 23 && index <= 25 ? classes.planEstimatedBodyCell : ''} ${
        index === 24 ? classes.planEstimatedBlueCell : ''
      } ${index === 26 || index === 27 ? classes.planTaxBodyCell : ''} ${
        index === 30 ? classes.planFinalBodyCell : ''
      }`,
    [index]
  )

  return { className }
}
