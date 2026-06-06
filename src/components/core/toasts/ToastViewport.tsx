'use client'

import { Notifications } from '@mantine/notifications'

export function ToastViewport() {
  return (
    <Notifications
      position='top-right'
      limit={3}
      autoClose={4500}
      zIndex={4000}
      pauseResetOnHover='notification'
      containerWidth={528}
    />
  )
}
