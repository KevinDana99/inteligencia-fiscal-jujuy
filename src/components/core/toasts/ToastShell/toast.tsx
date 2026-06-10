import { notifications } from '@mantine/notifications'
import { ToastContent } from '../ToastContent/ToastContent'
import classes from './ToastShell.module.css'
import type { ToastShowOptions } from '../types'
import { resolveToastMessage, ToastVariables } from '../utils'
import { ToastMessageType } from '../constants'

const TOAST_DEFAULT_AUTO_CLOSE = 4500
const TOAST_DEFAULT_POSITION = 'bottom-right'

function show(
  msg: ToastMessageType,
  vars?: ToastVariables,
  options?: ToastShowOptions
) {
  const message = resolveToastMessage(msg, vars)
  const { id, status, title, description } = message

  return notifications.show({
    id,
    position: options?.position ? options.position : TOAST_DEFAULT_POSITION,
    autoClose: options?.autoClose
      ? options.autoClose
      : TOAST_DEFAULT_AUTO_CLOSE,
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
