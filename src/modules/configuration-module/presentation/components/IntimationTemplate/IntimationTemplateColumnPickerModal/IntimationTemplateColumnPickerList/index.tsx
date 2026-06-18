'use client'

import { Card, Stack, Text } from '@mantine/core'
import { IconCheck, IconDragDrop } from '@tabler/icons-react'
import type { IntimationTemplateColumnPickerModalController } from '../useIntimationTemplateColumnPickerModal'
import classes from './IntimationTemplateColumnPickerList.module.css'

type IntimationTemplateColumnPickerListProps =
  | IntimationTemplateColumnPickerModalController['availableList']
  | IntimationTemplateColumnPickerModalController['visibleList']

export function IntimationTemplateColumnPickerList({
  title,
  rows
}: IntimationTemplateColumnPickerListProps) {
  return (
    <Card className={classes.columnPickerCard} radius='lg' padding={0}>
      <div className={classes.columnPickerHeader}>{title}</div>
      <Stack gap='xs' className={classes.columnPickerList}>
        {rows.map((row) => (
          <button
            key={row.id}
            type='button'
            className={row.className}
            draggable={row.draggable}
            aria-pressed={row.isSelected}
            onClick={row.handleSelect}
            onDragStart={row.handleDragStart}
            onDragEnd={row.handleDragEnd}
            onDragOver={row.handleDragOver}
            onDragLeave={row.handleDragLeave}
            onDrop={row.handleDrop}
          >
            {row.draggable ? (
              <span
                aria-hidden='true'
                className={classes.columnPickerDragHandle}
                title={row.dragHandleLabel}
              >
                <IconDragDrop size={14} />
              </span>
            ) : null}
            <span
              aria-hidden='true'
              className={[
                classes.columnPickerCheckbox,
                row.isSelected ? classes.columnPickerCheckboxChecked : null
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {row.isSelected ? <IconCheck size={12} /> : null}
            </span>
            <Text className={classes.columnPickerLabel}>{row.label}</Text>
          </button>
        ))}
      </Stack>
    </Card>
  )
}
