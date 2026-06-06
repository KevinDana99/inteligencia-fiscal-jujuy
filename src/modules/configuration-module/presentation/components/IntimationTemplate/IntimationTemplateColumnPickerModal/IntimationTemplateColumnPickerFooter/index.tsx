'use client'

import { Button, Group } from '@mantine/core'
import type { IntimationTemplateColumnPickerModalController } from '../useIntimationTemplateColumnPickerModal'
import classes from './IntimationTemplateColumnPickerFooter.module.css'

type IntimationTemplateColumnPickerFooterProps =
  IntimationTemplateColumnPickerModalController['footer']

export function IntimationTemplateColumnPickerFooter({
  cancelLabel,
  acceptLabel,
  onCancel,
  onConfirm
}: IntimationTemplateColumnPickerFooterProps) {
  return (
    <Group justify='flex-end' className={classes.columnPickerFooter}>
      <Button
        variant='default'
        className={classes.modalCancelButton}
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button className={classes.primaryButton} onClick={onConfirm}>
        {acceptLabel}
      </Button>
    </Group>
  )
}
