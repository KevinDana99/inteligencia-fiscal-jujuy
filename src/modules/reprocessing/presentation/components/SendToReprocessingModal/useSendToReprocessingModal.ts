'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IReprocessingMarkPayload } from '../../../data/models/Reprocessing'

export interface ISendToReprocessingModalProps {
  opened: boolean
  contribuyenteId: string
  cuit: string
  razonSocial: string
  onClose: () => void
  onConfirm?: (payload: IReprocessingMarkPayload) => void | Promise<void>
}

export function useSendToReprocessingModal({
  opened,
  contribuyenteId,
  cuit,
  razonSocial,
  onClose,
  onConfirm
}: ISendToReprocessingModalProps) {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!opened) {
      setDescription('')
      setIsSubmitting(false)
    }
  }, [opened])

  const subtitle = useMemo(() => `${cuit} — ${razonSocial}`, [cuit, razonSocial])

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    onClose()
  }

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose()
      return
    }

    setIsSubmitting(true)

    try {
      await onConfirm({
        contribuyenteId,
        description: description || null
      })
      onClose()
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
