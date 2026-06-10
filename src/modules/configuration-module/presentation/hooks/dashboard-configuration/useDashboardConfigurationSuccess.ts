'use client'

import { useCallback } from 'react'
import { toast } from '@/components/core/toasts'
import { TOAST_DASHBOARD_MESSAGES } from '@/components/core/toasts/constants/Dashboard/ToastMessages'

export function useDashboardConfigurationSuccess() {
  const confirmChanges = useCallback(() => {
    const message = TOAST_DASHBOARD_MESSAGES.GENERATING_CROSSES_INFO

    toast.show(message)
  }, [])

  return {
    confirmChanges
  }
}
