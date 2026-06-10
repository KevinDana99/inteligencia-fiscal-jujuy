import { notifications } from '@mantine/notifications'
import { ToastContent } from '../ToastContent/ToastContent'
import classes from './ToastShell.module.css'
import type { ToastBaseOptions } from '../types'

const TOAST_DEFAULT_AUTO_CLOSE = 4500
const TOAST_DEFAULT_POSITION = 'bottom-right'

function show({
  id,
  title,
  description,
  status,
  autoClose = TOAST_DEFAULT_AUTO_CLOSE,
  position = TOAST_DEFAULT_POSITION
}: ToastBaseOptions) {
  return notifications.show({
    id,
    position,
    autoClose,
    withCloseButton: true,
    allowClose: true,
    message: (
      <ToastContent title={title} description={description} status={status} />
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
  show,
  hide: notifications.hide,
  clean: notifications.clean
} as const
