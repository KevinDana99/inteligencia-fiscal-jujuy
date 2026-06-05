'use client'

import { Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { SEND_TO_REPROCESSING_MODAL_LABELS } from '../../../constants/sendToReprocessingModalLabels'
import classes from './SendToReprocessingModalAlert.module.css'

export function SendToReprocessingModalAlert() {
  return (
    <div className={classes.alertBox}>
      <IconAlertTriangle size={16} className={classes.alertIcon} />
      <Text className={classes.alertText}>
        <span className={classes.alertTextLine}>
          {SEND_TO_REPROCESSING_MODAL_LABELS.alertLineOne}
        </span>
        <span className={classes.alertTextLine}>
          {SEND_TO_REPROCESSING_MODAL_LABELS.alertLineTwo}
        </span>
      </Text>
    </div>
  )
}
