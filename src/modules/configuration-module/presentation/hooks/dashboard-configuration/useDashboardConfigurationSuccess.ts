'use client'

import { useCallback } from 'react'
import {
  TOAST_DASHBOARD_CONFIGURATION,
  toast
} from '@/components/core/toasts'

export function useDashboardConfigurationSuccess() {
  const confirmChanges = useCallback(() => {
    const message = TOAST_DASHBOARD_CONFIGURATION.success.update_configuration

    toast.success({
      title: message.title,
      description: message.description
    })
  }, [])

  return {
    confirmChanges
  }
}
