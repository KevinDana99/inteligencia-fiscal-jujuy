'use client'

import { Modal, Text } from '@mantine/core'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import classes from './ConfigurationSuccessModal.module.css'

type ConfigurationSuccessModalProps = {
  opened: boolean
  onClose: () => void
}

export function ConfigurationSuccessModal({
  opened,
  onClose
}: ConfigurationSuccessModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      zIndex={800}
      title={DASHBOARD_CONFIGURATION_LABELS.successModal.title}
      classNames={{
        overlay: classes.modalOverlay,
        content: classes.modalContent,
        header: classes.modalHeader,
        body: classes.modalBody,
        title: classes.modalTitle,
        close: classes.modalClose
      }}
    >
      <Text className={classes.modalText}>
        {DASHBOARD_CONFIGURATION_LABELS.successModal.message}
      </Text>
    </Modal>
  )
}
