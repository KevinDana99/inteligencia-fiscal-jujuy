'use client'

import { Modal, Text } from '@mantine/core'
import {
  useSendToReprocessingModal,
  type ISendToReprocessingModalProps
} from '../../hooks'
import { SendToReprocessingModalAlert } from './SendToReprocessingModalAlert'
import { SendToReprocessingModalFooter } from './SendToReprocessingModalFooter'
import { SendToReprocessingModalForm } from './SendToReprocessingModalForm'
import { SendToReprocessingModalHeader } from './SendToReprocessingModalHeader'
import classes from './SendToReprocessingModal.module.css'

export function SendToReprocessingModal(
  props: ISendToReprocessingModalProps
) {
  const {
    description,
    isSubmitting,
    subtitle,
    setDescription,
    handleClose,
    handleConfirm
  } = useSendToReprocessingModal(props)

  return (
    <Modal
      opened={props.opened}
      onClose={handleClose}
      centered
      zIndex={900}
      withCloseButton
      title={<SendToReprocessingModalHeader subtitle={subtitle} />}
      classNames={{
        content: classes.modalContent,
        overlay: classes.modalOverlay,
        header: classes.modalHeader,
        body: classes.modalBody,
        close: classes.modalCloseButton
      }}
    >
      <SendToReprocessingModalForm
        description={description}
        onChange={setDescription}
      />

      <SendToReprocessingModalAlert />

      {props.error ? (
        <Text className={classes.errorText}>{props.error}</Text>
      ) : null}

      <SendToReprocessingModalFooter
        isSubmitting={isSubmitting}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export type { ISendToReprocessingModalProps } from '../../hooks'
