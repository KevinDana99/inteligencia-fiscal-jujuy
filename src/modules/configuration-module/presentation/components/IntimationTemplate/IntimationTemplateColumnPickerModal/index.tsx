'use client'

import { Modal, Text } from '@mantine/core'
import type { IntimationTemplateController } from '../../../hooks/intimation-template'
import { IntimationTemplateColumnPickerActions } from './IntimationTemplateColumnPickerActions'
import { IntimationTemplateColumnPickerFooter } from './IntimationTemplateColumnPickerFooter'
import { IntimationTemplateColumnPickerList } from './IntimationTemplateColumnPickerList'
import { useIntimationTemplateColumnPickerModal } from './useIntimationTemplateColumnPickerModal'
import classes from './IntimationTemplateColumnPickerModal.module.css'

type IntimationTemplateColumnPickerModalProps = {
  controller: IntimationTemplateController
}

export function IntimationTemplateColumnPickerModal({
  controller
}: IntimationTemplateColumnPickerModalProps) {
  const modalController = useIntimationTemplateColumnPickerModal(controller)

  return (
    <Modal
      opened={modalController.modal.opened}
      onClose={modalController.modal.onClose}
      centered
      zIndex={820}
      size={620}
      title={
        <div className={classes.modalTitleWrap}>
          <Text className={classes.modalTitle}>
            {modalController.modal.title}
          </Text>
          <Text className={classes.modalSubtitle}>
            {modalController.modal.subtitle}
          </Text>
        </div>
      }
      classNames={modalController.modal.classNames}
    >
      <div className={classes.columnPickerGrid}>
        <IntimationTemplateColumnPickerList
          {...modalController.availableList}
        />

        <IntimationTemplateColumnPickerActions {...modalController.actions} />

        <IntimationTemplateColumnPickerList {...modalController.visibleList} />
      </div>

      <IntimationTemplateColumnPickerFooter {...modalController.footer} />
    </Modal>
  )
}
