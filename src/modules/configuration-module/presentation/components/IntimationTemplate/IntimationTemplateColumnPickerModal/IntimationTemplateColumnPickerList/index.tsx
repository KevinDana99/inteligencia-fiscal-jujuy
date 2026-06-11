'use client'

import { Card, Stack, Text } from '@mantine/core'
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
            onClick={row.handleSelect}
          >
            <Text className={classes.columnPickerLabel}>{row.label}</Text>
          </button>
        ))}
      </Stack>
    </Card>
  )
}
