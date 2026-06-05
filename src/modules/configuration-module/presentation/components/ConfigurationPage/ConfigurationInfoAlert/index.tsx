'use client'

import { Alert, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import classes from './ConfigurationInfoAlert.module.css'

export function ConfigurationInfoAlert() {
  return (
    <Alert
      variant='light'
      color='blue'
      radius='md'
      className={classes.infoAlert}
      icon={<IconInfoCircle size={16} />}
    >
      <Text className={classes.infoAlertText}>
        <strong>Configuración global del Informe de Investigación.</strong>{' '}
        {DASHBOARD_CONFIGURATION_LABELS.infoAlert}
      </Text>
    </Alert>
  )
}
