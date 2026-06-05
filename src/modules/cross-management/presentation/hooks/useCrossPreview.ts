'use client'

import type { ICrossPreviewData } from '../../data/models/CrossManagement'
import { useCrossPreviewAnalysisFilters } from './cross-preview/useCrossPreviewAnalysisFilters'
import { useCrossPreviewModalState } from './cross-preview/useCrossPreviewModalState'
import { useCrossPreviewSearchResults } from './cross-preview/useCrossPreviewSearchResults'
import { useCrossPreviewStatus } from './cross-preview/useCrossPreviewStatus'
import {
  useCrossPreviewTabs,
  type CrossPreviewTab
} from './cross-preview/useCrossPreviewTabs'
import type { CrossPreviewStatus } from './cross-preview/useCrossPreviewStatus'

export type { CrossPreviewStatus, CrossPreviewTab }

export function useCrossPreview(cross: ICrossPreviewData) {
  const tabs = useCrossPreviewTabs()
  const filters = useCrossPreviewAnalysisFilters({ rows: cross.analysisRows })
  const status = useCrossPreviewStatus({ rows: cross.analysisRows })
  const modals = useCrossPreviewModalState({
    maxPreviewIndex: Math.max(cross.planRows.length - 1, 0)
  })
  const searchResults = useCrossPreviewSearchResults({
    analysisRows: filters.analysisRows,
    planRows: cross.planRows,
    planillaSearch: tabs.planillaSearch,
    resumenSearch: tabs.resumenSearch
  })

  return {
    ...filters,
    ...modals,
    ...searchResults,
    ...status,
    ...tabs
  }
}
