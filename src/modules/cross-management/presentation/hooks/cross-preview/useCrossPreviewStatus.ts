'use client'

import { useCallback, useMemo, useState } from 'react'
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts'
import { markReprocessingAction } from '@/modules/reprocessing/data/actions'
import type { IReprocessingMarkPayload } from '@/modules/reprocessing/data/models/Reprocessing'
import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'

export type CrossPreviewStatus = ICrossPreviewAnalysisRow['status']

interface UseCrossPreviewStatusParams {
  rows: ICrossPreviewAnalysisRow[]
  taxpayerIdByCuit: Record<string, string | null | undefined>
}

export function useCrossPreviewStatus({
  rows,
  taxpayerIdByCuit
}: UseCrossPreviewStatusParams) {
  const [reprocessingActionError, setReprocessingActionError] = useState<
    string | null
  >(null)
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
      setReprocessingActionError(null)

      if (status === 'reproceso') {
        setPendingReprocessingRow(row)
        return
      }

      updateAnalysisStatus(row.cuit, status)
    },
    [updateAnalysisStatus]
  )

  const closeReprocessingModal = useCallback(() => {
    setReprocessingActionError(null)
    setPendingReprocessingRow(null)
  }, [])

  const confirmReprocessingModal = useCallback(async (
    payload: IReprocessingMarkPayload
  ) => {
    if (!pendingReprocessingRow) {
      return
    }

    setReprocessingActionError(null)

    const contribuyenteId =
      pendingReprocessingRow.taxpayerId ??
      taxpayerIdByCuit[pendingReprocessingRow.cuit] ??
      null

    if (!contribuyenteId) {
      const errorMessage =
        'No se encontró el identificador del contribuyente para marcar el reproceso.'
      setReprocessingActionError(errorMessage)
      throw new Error(errorMessage)
    }

    const result = await markReprocessingAction({
      contribuyenteId,
      description: payload.description?.trim() || null
    })

    if (!result.success) {
      const errorMessage =
        result.error ?? 'No fue posible marcar el CUIT en reproceso.'
      setReprocessingActionError(errorMessage)
      throw new Error(errorMessage)
    }

    updateAnalysisStatus(pendingReprocessingRow.cuit, 'reproceso')
    setPendingReprocessingRow(null)
    toast.show(TOAST_DASHBOARD_MESSAGES.SEND_REPROCESSING_ERROR)
  }, [pendingReprocessingRow, taxpayerIdByCuit, updateAnalysisStatus])

  return {
    closeReprocessingModal,
    confirmReprocessingModal,
    pendingReprocessingRow,
    reprocessingActionError,
    requestAnalysisStatusChange,
    statusByCuit,
    updateAnalysisStatus
  }
}
