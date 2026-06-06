'use client'

import { Stack, Text } from '@mantine/core'
import { SEND_TO_REPROCESSING_MODAL_LABELS } from '../../../constants/sendToReprocessingModalLabels'
import classes from './SendToReprocessingModalHeader.module.css'

interface SendToReprocessingModalHeaderProps {
  subtitle: string
}

export function SendToReprocessingModalHeader({
  subtitle
}: SendToReprocessingModalHeaderProps) {
  return (
    <Stack className={classes.headerStack}>
      <div className={classes.titleRow}>
        <span className={classes.statusBadge}>
          <span className={classes.statusDot} />
          {SEND_TO_REPROCESSING_MODAL_LABELS.statusBadge}
        </span>
        <Text className={classes.title}>{SEND_TO_REPROCESSING_MODAL_LABELS.title}</Text>
      </div>
      <Text className={classes.subtitle}>{subtitle}</Text>
    </Stack>
  )
}
