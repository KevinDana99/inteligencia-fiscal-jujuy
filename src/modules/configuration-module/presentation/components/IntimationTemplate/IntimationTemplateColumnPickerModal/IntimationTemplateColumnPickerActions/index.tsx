'use client'

import { ActionIcon } from '@mantine/core'
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react'
import type { IntimationTemplateColumnPickerModalController } from '../useIntimationTemplateColumnPickerModal'
import classes from './IntimationTemplateColumnPickerActions.module.css'

type IntimationTemplateColumnPickerActionsProps =
  IntimationTemplateColumnPickerModalController['actions']

export function IntimationTemplateColumnPickerActions({
  addButton,
  removeButton
}: IntimationTemplateColumnPickerActionsProps) {
  return (
    <div className={classes.columnPickerArrows}>
      <ActionIcon
        variant='default'
        size='lg'
        aria-label={addButton.label}
        className={classes.columnPickerArrowButton}
        onClick={addButton.onClick}
        disabled={addButton.disabled}
      >
        <IconArrowNarrowRight size={18} />
      </ActionIcon>
      <ActionIcon
        variant='default'
        size='lg'
        aria-label={removeButton.label}
        className={classes.columnPickerArrowButton}
        onClick={removeButton.onClick}
        disabled={removeButton.disabled}
      >
        <IconArrowNarrowLeft size={18} />
      </ActionIcon>
    </div>
  )
}
