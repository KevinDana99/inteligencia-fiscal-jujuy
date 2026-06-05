'use client'

import { useCallback, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import type { CrossPreviewStatus } from './useCrossPreviewStatus'
import classes from '../../components/CrossPreviewPage/CrossPreviewPage.module.css'

interface UseCrossPreviewStatusSelectParams {
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  row: ICrossPreviewAnalysisRow
  status: CrossPreviewStatus
}

export function useCrossPreviewStatusSelect({
  onRequestStatusChange,
  row,
  status
}: UseCrossPreviewStatusSelectParams) {
  const className = useMemo(
    () =>
      `${classes.statusSelect} ${
        status === 'relevante'
          ? classes.statusSelectRelevant
          : status === 'reproceso'
            ? classes.statusSelectReprocessing
            : classes.statusSelectNeutral
      }`,
    [status]
  )

  const handleStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onRequestStatusChange(row, event.currentTarget.value as CrossPreviewStatus)
    },
    [onRequestStatusChange, row]
  )

  return {
    className,
    handleStatusChange
  }
}
