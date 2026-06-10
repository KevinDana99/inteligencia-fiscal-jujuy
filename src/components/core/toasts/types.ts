import type { NotificationData } from '@mantine/notifications'
import { ToastStatus } from './constants'
import { ReactNode } from 'react'

export type ToastPosition = NonNullable<NotificationData['position']>

export interface ToastBaseOptions {
  id: string
  title: string
  status: ToastStatus
  description?: string
  autoClose?: NotificationData['autoClose']
  position?: ToastPosition
}

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
