import type { ReactNode } from 'react'
import type { NotificationData } from '@mantine/notifications'

export type ToastPosition = NonNullable<NotificationData['position']>

export interface ToastSuccessOptions {
  id?: string
  title: string
  description?: string
  autoClose?: NotificationData['autoClose']
  position?: ToastPosition
  icon?: ReactNode
}
