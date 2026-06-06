'use client'

import type { ICrossPreviewData } from '../../data/models/CrossManagement'
import { useCrossPreviewModalState } from './cross-preview/useCrossPreviewModalState'
import { useCrossPreviewPlanillaQuery } from './cross-preview/useCrossPreviewPlanillaQuery'
import { useCrossPreviewResumenQuery } from './cross-preview/useCrossPreviewResumenQuery'
import { useCrossPreviewStatus } from './cross-preview/useCrossPreviewStatus'
import {
  useCrossPreviewTabs,
  type CrossPreviewTab
} from './cross-preview/useCrossPreviewTabs'
import type { CrossPreviewStatus } from './cross-preview/useCrossPreviewStatus'

export type { CrossPreviewStatus, CrossPreviewTab }

export function useCrossPreview(cross: ICrossPreviewData) {
  const tabs = useCrossPreviewTabs()
  const planilla = useCrossPreviewPlanillaQuery({ cross })
  const resumen = useCrossPreviewResumenQuery({ cross })
  const status = useCrossPreviewStatus({ rows: resumen.analysisRows })
  const modals = useCrossPreviewModalState({
    maxPreviewIndex: Math.max(planilla.rows.length - 1, 0)
  })

  const updateTab = (tab: CrossPreviewTab) => {
    tabs.updateTab(tab)

    if (tab === 'planilla' && planilla.search) {
      planilla.setSearch('')
    }

    if (tab === 'resumen' && resumen.search) {
      resumen.setSearch('')
    }
  }

  return {
    ...modals,
    ...status,
    ...tabs,
    activeFilterColumn: resumen.activeFilterColumn,
    analysisColumns: resumen.analysisColumns,
    analysisRows: resumen.analysisRows,
    applyFilter: resumen.applyFilter,
    clearFilter: resumen.clearFilter,
    closeFilterModal: resumen.closeFilterModal,
    columnFilters: resumen.columnFilters,
    filterableColumns: resumen.filterableColumns,
    openFilterModal: resumen.openFilterModal,
    planillaColumns: planilla.columns,
    planillaError: planilla.error,
    planillaIsLoading: planilla.isLoading,
    planillaPagination: planilla.pagination,
    planillaRows: planilla.rows,
    planillaSearch: planilla.search,
    resumenError: resumen.error,
    resumenIsLoading: resumen.isLoading,
    resumenPagination: resumen.pagination,
    resumenRows: resumen.analysisRows,
    resumenSearch: resumen.search,
    setPlanillaPage: planilla.setPage,
    setPlanillaSearch: planilla.setSearch,
    setResumenPage: resumen.setPage,
    setResumenSearch: resumen.setSearch,
    summaryBlocks: resumen.summaryBlocks,
    updateTab
  }
}
