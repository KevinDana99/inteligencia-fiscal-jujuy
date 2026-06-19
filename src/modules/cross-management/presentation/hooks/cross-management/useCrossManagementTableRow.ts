'use client'

import { useCallback, useMemo } from 'react'
import type { ICrossManagementItem } from '../../../data/models/CrossManagement'
import classes from '../../components/CrossManagementTable/CrossManagementTableRow.module.css'

interface UseCrossManagementTableRowParams {
  item: ICrossManagementItem
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

type CrossManagementStatusIcon = 'check' | 'clock' | 'x' | null

const COMPLETED_STATUSES = [
  'completada',
  'completado',
  'finalizada',
  'finalizado',
  'complete',
  'completed'
]

const RUNNING_STATUSES = [
  'en_proceso',
  'en_ejecucion',
  'ejecutando',
  'procesando',
  'running'
]

const FAILED_STATUSES = [
  'fallida',
  'fallido',
  'error',
  'failed',
  'rechazada',
  'rechazado'
]

const PENDING_STATUSES = ['pendiente', 'creada', 'creado', 'queued', 'en_cola']

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

  if (COMPLETED_STATUSES.includes(normalizedStatus)) {
    return classes.statusBadgeCompleted
  }

  if (RUNNING_STATUSES.includes(normalizedStatus)) {
    return classes.statusBadgeRunning
  }

  if (FAILED_STATUSES.includes(normalizedStatus)) {
    return classes.statusBadgeFailed
  }

  if (PENDING_STATUSES.includes(normalizedStatus)) {
    return classes.statusBadgePending
  }

  return classes.statusBadgeDefault
}

function getStatusIcon(status: string): CrossManagementStatusIcon {
  const normalizedStatus = normalizeStatus(status)

  if (COMPLETED_STATUSES.includes(normalizedStatus)) {
    return 'check'
  }

  if (RUNNING_STATUSES.includes(normalizedStatus)) {
    return 'clock'
  }

  if (FAILED_STATUSES.includes(normalizedStatus)) {
    return 'x'
  }

  return null
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
  const statusIcon = useMemo(
    () => getStatusIcon(item.status),
    [item.status]
  )

  const handleOpenCrossPreview = useCallback(() => {
    onOpenCrossPreview(item)
  }, [item, onOpenCrossPreview])

  return {
    handleOpenCrossPreview,
    sourceBadgeClassName,
    statusBadgeClassName,
    statusIcon,
    statusLabel
  }
}
