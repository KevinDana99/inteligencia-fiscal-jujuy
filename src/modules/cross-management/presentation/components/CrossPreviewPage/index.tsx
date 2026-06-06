'use client'

import type { ICrossPreviewData } from '../../../data/models/CrossManagement'
import { CrossPreviewEmptyState } from './CrossPreviewEmptyState'
import { CrossPreviewPageContent } from './CrossPreviewPageContent'

interface CrossPreviewPageProps {
  cross: ICrossPreviewData | null
  error?: string
}

export function CrossPreviewPage({ cross, error }: CrossPreviewPageProps) {
  if (!cross) {
    return <CrossPreviewEmptyState message={error} />
  }

  return <CrossPreviewPageContent cross={cross} />
}
