'use client'

import { useCallback } from 'react'

export function useAdminPanelAllowedDomainItem({
  domainId,
  onRemoveDomain
}: UseAdminPanelAllowedDomainItemOptions) {
  const handleRemoveDomain = useCallback(() => {
    onRemoveDomain(domainId)
  }, [domainId, onRemoveDomain])

  return {
    handleRemoveDomain
  }
}

interface UseAdminPanelAllowedDomainItemOptions {
  domainId: number
  onRemoveDomain: (domainId: number) => void
}
