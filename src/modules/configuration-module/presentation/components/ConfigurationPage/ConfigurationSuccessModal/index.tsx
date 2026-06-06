'use client'

import { Modal, Text } from '@mantine/core'
import { useConfigurationSuccessModal } from '../../../hooks/configuration-page'
import classes from './ConfigurationSuccessModal.module.css'

type ConfigurationSuccessModalProps = {
  opened: boolean
  onClose: () => void
}

export function ConfigurationSuccessModal({
  opened,
  onClose
}: ConfigurationSuccessModalProps) {
  const successModal = useConfigurationSuccessModal({
    opened,
    onClose,
    classes
  })

  return (
    <Modal
      opened={successModal.modal.opened}
      onClose={successModal.modal.onClose}
      centered
      zIndex={800}
      title={successModal.modal.title}
      classNames={successModal.modal.classNames}
    >
      <Text className={classes.modalText}>{successModal.message}</Text>
    </Modal>
  )
}
