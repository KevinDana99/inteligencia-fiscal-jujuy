'use client'

import { notifications } from '@mantine/notifications'
import { ToastContent } from '../ToastContent/ToastContent'
import classes from './ToastShell.module.css'
import type { ToastSuccessOptions } from '../types'

const TOAST_DEFAULT_AUTO_CLOSE = 4500
const TOAST_DEFAULT_POSITION = 'bottom-right'

function success({
  id,
  title,
  description,
  autoClose = TOAST_DEFAULT_AUTO_CLOSE,
  position = TOAST_DEFAULT_POSITION,
  icon
}: ToastSuccessOptions): string {
  return notifications.show({
    id,
    position,
    autoClose,
    withCloseButton: false,
    allowClose: true,
    message: (
      <ToastContent title={title} description={description} icon={icon} />
    ),
    classNames: {
      root: classes.notificationRoot,
      body: classes.notificationBody,
      description: classes.notificationMessage,
      closeButton: classes.notificationCloseButton
    }
  })
}

export const toast = {
  success,
  hide: notifications.hide,
  clean: notifications.clean
} as const
