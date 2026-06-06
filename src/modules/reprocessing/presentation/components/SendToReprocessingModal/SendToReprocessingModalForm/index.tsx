'use client'

import { Text, Textarea } from '@mantine/core'
import { SEND_TO_REPROCESSING_MODAL_LABELS } from '../../../constants/sendToReprocessingModalLabels'
import classes from './SendToReprocessingModalForm.module.css'

interface SendToReprocessingModalFormProps {
  description: string
  onChange: (value: string) => void
}

export function SendToReprocessingModalForm({
  description,
  onChange
}: SendToReprocessingModalFormProps) {
  return (
    <div className={classes.fieldGroup}>
      <Text component="label" className={classes.fieldLabel}>
        {SEND_TO_REPROCESSING_MODAL_LABELS.fieldLabel}{' '}
        <span className={classes.optionalLabel}>
          {SEND_TO_REPROCESSING_MODAL_LABELS.optionalLabel}
        </span>
      </Text>
      <Textarea
        value={description}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={SEND_TO_REPROCESSING_MODAL_LABELS.fieldPlaceholder}
        autosize
        minRows={3}
        classNames={{ input: classes.textarea }}
      />
      <Text className={classes.fieldHint}>
        {SEND_TO_REPROCESSING_MODAL_LABELS.fieldHint}
      </Text>
    </div>
  )
}
