'use client'

import { useMemo } from 'react'
import type { ICrossPreviewData } from '../../data/models/CrossManagement'
import { groupIntimationExportContributors } from '../utils/groupIntimationExportContributors'
import { buildIntimationColumnOptionsFromPlanilla } from '../utils/buildIntimationColumnOptionsFromPlanilla'
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
  const tabs = useCrossPreviewTabs(cross.viewsAvailable)
  const planilla = useCrossPreviewPlanillaQuery({ cross })
  const resumen = useCrossPreviewResumenQuery({ cross })
  const taxpayerIdByCuit = useMemo(
    () => {
      const rowsWithContributorId = [...cross.planRows, ...planilla.rows].filter(
        (row) => row.taxpayerId
      )

      return Object.fromEntries(
        rowsWithContributorId.map((row) => [row.cuit, row.taxpayerId])
      )
    },
    [cross.planRows, planilla.rows]
  )
  const status = useCrossPreviewStatus({
    rows: resumen.analysisRows,
    taxpayerIdByCuit
  })
  const intimationContributors = useMemo(
    () => groupIntimationExportContributors(planilla.rows, resumen.analysisRows),
    [planilla.rows, resumen.analysisRows]
  )
  const intimationColumnOptions = useMemo(
    () =>
      buildIntimationColumnOptionsFromPlanilla(planilla.columns, planilla.rows),
    [planilla.columns, planilla.rows]
  )
  const modals = useCrossPreviewModalState({
    maxPreviewIndex: Math.max(intimationContributors.length - 1, 0)
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
    availableTabs: tabs.availableTabs,
    clearFilter: resumen.clearFilter,
    closeFilterModal: resumen.closeFilterModal,
    columnFilters: resumen.columnFilters,
    filterableColumns: resumen.filterableColumns,
    gridStateBySection: resumen.gridStateBySection,
    intimationColumnOptions,
    intimationContributors,
    loadingResumenSectionKey: resumen.loadingSectionKey,
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
    resumenSections: resumen.resumenSections,
    resumenSearch: resumen.search,
    setPlanillaPage: planilla.setPage,
    setPlanillaSearch: planilla.setSearch,
    setResumenPage: resumen.setPage,
    setResumenSearch: resumen.setSearch,
    setResumenSectionPage: resumen.setSectionPage,
    setResumenSectionSearch: resumen.setSectionSearch,
    summaryBlocks: resumen.summaryBlocks,
    updateTab
  }
}
