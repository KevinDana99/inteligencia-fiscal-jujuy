'use client'

import { useCallback } from 'react'
import { toast } from '@/components/core/toasts'
import TOAST_ADMIN_MESSAGES from '@/components/core/toasts/constants/AdminPanel/ToastMessages'

export function useDashboardConfigurationSuccess() {
  const confirmChanges = useCallback(() => {
    toast.show(TOAST_ADMIN_MESSAGES.ADD_DOMAIN_SUCCESS, {
      domain: '@pepit.com'
    })
  }, [])

  return {
    confirmChanges
  }
}
