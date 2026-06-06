'use client'

import { Checkbox, Stack } from '@mantine/core'
import type { BatchManagementCrossSectionController } from '../BatchManagementCrossMenu/useBatchManagementCrossMenu'
import styles from './BatchManagementCrossPeriodFields.module.css'

type BatchManagementCrossTypeOptionsProps = {
  optionLabels: BatchManagementCrossSectionController['optionLabels']
  selectedCrossTypes: BatchManagementCrossSectionController['selectedCrossTypes']
  onCrossTypeToggle: BatchManagementCrossSectionController['onCrossTypeToggle']
}

export function BatchManagementCrossTypeOptions({
  optionLabels,
  selectedCrossTypes,
  onCrossTypeToggle
}: BatchManagementCrossTypeOptionsProps) {
  return (
    <Stack gap={0} className={styles.crossChecks}>
      {optionLabels.map((option) => (
        <Checkbox
          key={option}
          label={option}
          checked={selectedCrossTypes.includes(option)}
          onChange={() => onCrossTypeToggle(option)}
          color="blue"
          size="xs"
          classNames={{
            root: styles.crossMenuCheckbox,
            body: styles.crossMenuCheckboxBody,
            input: styles.crossMenuCheckboxInput,
            label: styles.crossMenuCheckboxLabel
          }}
        />
      ))}
    </Stack>
  )
}
