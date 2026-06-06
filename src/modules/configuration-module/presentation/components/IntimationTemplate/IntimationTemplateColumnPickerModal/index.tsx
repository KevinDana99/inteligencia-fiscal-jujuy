'use client'

import { ActionIcon, Button, Card, Group, Modal, Stack, Text } from '@mantine/core'
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react'
import type { IntimationTemplateController } from '../useIntimationTemplate'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import classes from './IntimationTemplateColumnPickerModal.module.css'

type IntimationTemplateColumnPickerModalProps = {
  controller: IntimationTemplateController
}

export function IntimationTemplateColumnPickerModal({
  controller
}: IntimationTemplateColumnPickerModalProps) {
  const {
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn
  } = controller

  return (
    <Modal
      opened={columnPickerOpened}
      onClose={closeColumnPicker}
      centered
      zIndex={820}
      size={620}
      title={
        <div className={classes.modalTitleWrap}>
          <Text className={classes.modalTitle}>
            {INTIMATION_TEMPLATE_LABELS.modal.title}
          </Text>
          <Text className={classes.modalSubtitle}>
            {INTIMATION_TEMPLATE_LABELS.modal.subtitle}
          </Text>
        </div>
      }
      classNames={{
        overlay: classes.modalOverlay,
        content: classes.columnModalContent,
        header: classes.modalHeader,
        body: classes.columnModalBody,
        close: classes.modalClose
      }}
    >
      <div className={classes.columnPickerGrid}>
        <Card className={classes.columnPickerCard} radius='lg' padding={0}>
          <div className={classes.columnPickerHeader}>
            {INTIMATION_TEMPLATE_LABELS.modal.availableColumns}
          </div>
          <Stack gap='xs' className={classes.columnPickerList}>
            {availableColumns.map((column) => (
              <div
                key={column.id}
                className={`${classes.columnPickerRow} ${selectedAvailableColumnId === column.id ? classes.columnPickerRowSelected : ''}`}
                onClick={() => selectAvailableColumn(column.id)}
                role='button'
                tabIndex={0}
              >
                <Text className={classes.columnPickerLabel}>{column.label}</Text>
              </div>
            ))}
          </Stack>
        </Card>

        <div className={classes.columnPickerArrows}>
          <ActionIcon
            variant='default'
            size='lg'
            className={classes.columnPickerArrowButton}
            onClick={addSelectedColumn}
            disabled={!selectedAvailableColumnId}
          >
            <IconArrowNarrowRight size={18} />
          </ActionIcon>
          <ActionIcon
            variant='default'
            size='lg'
            className={classes.columnPickerArrowButton}
            onClick={removeSelectedColumn}
            disabled={!selectedVisibleColumnId}
          >
            <IconArrowNarrowLeft size={18} />
          </ActionIcon>
        </div>

        <Card className={classes.columnPickerCard} radius='lg' padding={0}>
          <div className={classes.columnPickerHeader}>
            {INTIMATION_TEMPLATE_LABELS.modal.visibleColumns}
          </div>
          <Stack gap='xs' className={classes.columnPickerList}>
            {columnPickerDraft.map((column) => (
              <div
                key={column.id}
                className={`${classes.columnPickerRow} ${selectedVisibleColumnId === column.id ? classes.columnPickerRowSelected : ''}`}
                onClick={() => selectVisibleColumn(column.id)}
                role='button'
                tabIndex={0}
              >
                <Text className={classes.columnPickerLabel}>{column.value}</Text>
              </div>
            ))}
          </Stack>
        </Card>
      </div>

      <Group justify='flex-end' className={classes.columnPickerFooter}>
        <Button
          variant='default'
          className={classes.modalCancelButton}
          onClick={closeColumnPicker}
        >
          {INTIMATION_TEMPLATE_LABELS.buttons.cancel}
        </Button>
        <Button className={classes.primaryButton} onClick={confirmColumnPicker}>
          {INTIMATION_TEMPLATE_LABELS.buttons.accept}
        </Button>
      </Group>
    </Modal>
  )
}
