import type { NotificationData } from '@mantine/notifications'
import { ToastStatus } from './constants'
import { ReactNode } from 'react'

export type ToastPosition = NonNullable<NotificationData['position']>

export interface ToastShowOptions {
  autoClose?: NotificationData['autoClose']
  position?: ToastPosition
}

export interface ToastContentProps {
  title: string
  description?: string
  status?: ToastStatus
  icon?: ReactNode
}
