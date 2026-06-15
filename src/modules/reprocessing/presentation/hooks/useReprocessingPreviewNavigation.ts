'use client'

import type { KeyboardEvent } from 'react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import type { IReprocessingItem } from '../../data/models/Reprocessing'

const buildPreviewRoute = (cuit: string) =>
  `/vista-previa-padron/${encodeURIComponent(cuit)}` as Route

export function useReprocessingPreviewNavigation() {
  const router = useRouter()

  const navigateToPreview = (item: IReprocessingItem) => {
    router.push(buildPreviewRoute(item.cuit))
  }

  const handlePreviewRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    item: IReprocessingItem
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    navigateToPreview(item)
  }

  return {
    navigateToPreview,
    handlePreviewRowKeyDown
  }
}
