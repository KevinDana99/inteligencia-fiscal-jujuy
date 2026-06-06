'use client'

import { useCallback, useState } from 'react'

export function useDashboardConfigurationSuccess() {
  const [successOpened, setSuccessOpened] = useState(false)

  const confirmChanges = useCallback(() => {
    setSuccessOpened(true)
  }, [])

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false)
  }, [])

  return {
    successOpened,
    confirmChanges,
    closeSuccess
  }
}
