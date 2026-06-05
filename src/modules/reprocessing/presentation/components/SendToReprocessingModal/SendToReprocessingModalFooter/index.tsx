'use client'

import { Button, Group } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { SEND_TO_REPROCESSING_MODAL_LABELS } from '../../../constants/sendToReprocessingModalLabels'
import classes from './SendToReprocessingModalFooter.module.css'

interface SendToReprocessingModalFooterProps {
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function SendToReprocessingModalFooter({
  isSubmitting,
  onCancel,
  onConfirm
}: SendToReprocessingModalFooterProps) {
  return (
    <Group justify="flex-end" gap={8} className={classes.modalFooter}>
      <Button
        variant="default"
        className={classes.cancelButton}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {SEND_TO_REPROCESSING_MODAL_LABELS.cancelAction}
      </Button>
      <Button
        className={classes.confirmButton}
        onClick={() => {
          void onConfirm()
        }}
        loading={isSubmitting}
        leftSection={<IconCheck size={13} />}
      >
        {SEND_TO_REPROCESSING_MODAL_LABELS.confirmAction}
      </Button>
    </Group>
  )
}
