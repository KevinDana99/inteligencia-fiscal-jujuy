'use client'

import { useMemo } from 'react'
import type {
  ICrossPreviewAnalysisRow,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { filterCrossPreviewRowsBySearch } from '../../utils/filterCrossPreviewRowsBySearch'

interface UseCrossPreviewSearchResultsParams {
  analysisRows: ICrossPreviewAnalysisRow[]
  planRows: ICrossPreviewPlanRow[]
  planillaSearch: string
  resumenSearch: string
}

export function useCrossPreviewSearchResults({
  analysisRows,
  planRows,
  planillaSearch,
  resumenSearch
}: UseCrossPreviewSearchResultsParams) {
  const filteredPlanRows = useMemo(
    () => filterCrossPreviewRowsBySearch({ rows: planRows, search: planillaSearch }),
    [planRows, planillaSearch]
  )
  const filteredAnalysisRows = useMemo(
    () => filterCrossPreviewRowsBySearch({ rows: analysisRows, search: resumenSearch }),
    [analysisRows, resumenSearch]
  )

  return {
    filteredAnalysisRows,
    filteredPlanRows
  }
}
