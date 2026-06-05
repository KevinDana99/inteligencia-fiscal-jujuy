'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ICrossManagementItem } from '../../../data/models/CrossManagement'
import { CROSS_MANAGEMENT_PREVIEW_ROUTE } from '../../constants/crossManagementRoutes'

export function useCrossManagementNavigation() {
  const router = useRouter()

  const openCrossPreview = useCallback(
    (item: ICrossManagementItem) => {
      router.push(`${CROSS_MANAGEMENT_PREVIEW_ROUTE}/${encodeURIComponent(item.id)}`)
    },
    [router]
  )

  return { openCrossPreview }
}
