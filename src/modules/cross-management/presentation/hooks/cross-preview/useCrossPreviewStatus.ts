'use client'

import { useCallback, useMemo, useState } from 'react'
import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'

export type CrossPreviewStatus = ICrossPreviewAnalysisRow['status']

interface UseCrossPreviewStatusParams {
  rows: ICrossPreviewAnalysisRow[]
}

export function useCrossPreviewStatus({ rows }: UseCrossPreviewStatusParams) {
  const [pendingReprocessingRow, setPendingReprocessingRow] =
    useState<ICrossPreviewAnalysisRow | null>(null)
  const [statusOverridesByCuit, setStatusOverridesByCuit] =
    useState<Record<string, CrossPreviewStatus>>({})
  const statusByCuit = useMemo(
    () => ({
      ...Object.fromEntries(rows.map((row) => [row.cuit, row.status])),
      ...statusOverridesByCuit
    }),
    [rows, statusOverridesByCuit]
  )

  const updateAnalysisStatus = useCallback(
    (cuit: string, status: CrossPreviewStatus) => {
      setStatusOverridesByCuit((current) => ({
        ...current,
        [cuit]: status
      }))
    },
    []
  )

  const requestAnalysisStatusChange = useCallback(
    (row: ICrossPreviewAnalysisRow, status: CrossPreviewStatus) => {
      if (status === 'reproceso') {
        setPendingReprocessingRow(row)
        return
      }

      updateAnalysisStatus(row.cuit, status)
    },
    [updateAnalysisStatus]
  )

  const closeReprocessingModal = useCallback(() => {
    setPendingReprocessingRow(null)
  }, [])

  const confirmReprocessingModal = useCallback(() => {
    if (!pendingReprocessingRow) {
      return
    }

    updateAnalysisStatus(pendingReprocessingRow.cuit, 'reproceso')
    setPendingReprocessingRow(null)
  }, [pendingReprocessingRow, updateAnalysisStatus])

  return {
    closeReprocessingModal,
    confirmReprocessingModal,
    pendingReprocessingRow,
    requestAnalysisStatusChange,
    statusByCuit,
    updateAnalysisStatus
  }
}
