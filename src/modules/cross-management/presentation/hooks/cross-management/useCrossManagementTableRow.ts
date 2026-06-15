'use client'

import { useCallback, useMemo } from 'react'
import type { ICrossManagementItem } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossManagementTable/CrossManagementTableRow.module.css'

interface UseCrossManagementTableRowParams {
  item: ICrossManagementItem
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function formatStatusLabel(status: string) {
  const normalizedStatus = status.trim().replace(/[_-]+/g, ' ').toLowerCase()

  if (!normalizedStatus) {
    return '-'
  }

  return `${normalizedStatus.charAt(0).toUpperCase()}${normalizedStatus.slice(1)}`
}

function getStatusBadgeClassName(status: string) {
  const normalizedStatus = normalizeStatus(status)

  if (
    [
      'completada',
      'completado',
      'finalizada',
      'finalizado',
      'complete',
      'completed'
    ].includes(normalizedStatus)
  ) {
    return classes.statusBadgeCompleted
  }

  if (
    [
      'en_proceso',
      'en_ejecucion',
      'ejecutando',
      'procesando',
      'running'
    ].includes(normalizedStatus)
  ) {
    return classes.statusBadgeRunning
  }

  if (
    ['fallida', 'fallido', 'error', 'failed', 'rechazada', 'rechazado'].includes(
      normalizedStatus
    )
  ) {
    return classes.statusBadgeFailed
  }

  if (
    ['pendiente', 'creada', 'creado', 'queued', 'en_cola'].includes(
      normalizedStatus
    )
  ) {
    return classes.statusBadgePending
  }

  return classes.statusBadgeDefault
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
  const statusBadgeClassName = useMemo(
    () => getStatusBadgeClassName(item.status),
    [item.status]
  )
  const statusLabel = useMemo(
    () => formatStatusLabel(item.status),
    [item.status]
  )

  const handleOpenCrossPreview = useCallback(() => {
    onOpenCrossPreview(item)
  }, [item, onOpenCrossPreview])

  return {
    handleOpenCrossPreview,
    sourceBadgeClassName,
    statusBadgeClassName,
    statusLabel
  }
}
