import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle
} from '@tabler/icons-react'
import type { ToastStatus } from '../constants'
import classes from '../ToastContent/ToastContent.module.css'

export function getToastIconByStatus(status: ToastStatus) {
  switch (status) {
    case 'Danger':
      return (
        <IconAlertCircle
          aria-hidden
          className={classes.iconDanger}
          stroke={1.8}
        />
      )
    case 'Info':
      return (
        <IconInfoCircle aria-hidden className={classes.iconInfo} stroke={1.8} />
      )
    case 'Success':
    default:
      return (
        <IconCircleCheck
          aria-hidden
          className={classes.iconSuccess}
          stroke={1.8}
        />
      )
  }
}
