'use client'

import { useCallback, useState } from 'react'

export function useDashboardConfigurationSuccess() {
  const [successOpened, setSuccessOpened] = useState(false)

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false)
  }, [])

  return {
    successOpened,
    closeSuccess
  }
}
