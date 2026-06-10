'use client'

import { useCallback, useState } from 'react'
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts'

export function useDashboardConfigurationSuccess() {
  const confirmChanges = useCallback(() => {
    toast.show(TOAST_DASHBOARD_MESSAGES.UPDATE_CONFIGURATION_SUCCESS)
  }, [])

  const [successOpened, setSuccessOpened] = useState(false)

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false)
  }, [])

  return {
    successOpened,
    closeSuccess,
    confirmChanges
  }
}
