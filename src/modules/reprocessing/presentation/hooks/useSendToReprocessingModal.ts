'use client'

import { useState } from 'react'
import type { IReprocessingMarkPayload } from '../../data/models/Reprocessing'
import { buildReprocessingSubtitle } from '../utils'

export interface ISendToReprocessingModalProps {
  opened: boolean
  cuit: string
  razonSocial: string
  error?: string | null
  onClose: () => void
  onConfirm?: (payload: IReprocessingMarkPayload) => void | Promise<void>
}

export function useSendToReprocessingModal({
  cuit,
  razonSocial,
  onClose,
  onConfirm
}: ISendToReprocessingModalProps) {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtitle = buildReprocessingSubtitle(cuit, razonSocial)

  const resetState = () => {
    setDescription('')
    setIsSubmitting(false)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    resetState()
    onClose()
  }

  const handleConfirm = async () => {
    if (!onConfirm) {
      resetState()
      onClose()
      return
    }

    setIsSubmitting(true)

    try {
      await onConfirm({
        cuit,
        description: description.trim() || null
      })
      resetState()
      onClose()
    } catch {
      // The parent owns the visible error state and keeps the modal open.
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    description,
    isSubmitting,
    subtitle,
    setDescription,
    handleClose,
    handleConfirm
  }
}
