'use client'

import type { ICrossPreviewData } from '../../../data/models/CrossManagement'
import { useCrossPreview } from '../../hooks'
import { CrossPreviewHeaderCard } from './CrossPreviewHeaderCard'
import { CrossPreviewModals } from './CrossPreviewModals'
import { CrossPreviewPlanSection } from './CrossPreviewPlanSection'
import { CrossPreviewResumenSection } from './CrossPreviewResumenSection'
import { CrossPreviewTopBar } from './CrossPreviewTopBar'
import { CrossFilterModal } from '../CrossFilterModal'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPageContentProps {
  cross: ICrossPreviewData
}

export function CrossPreviewPageContent({ cross }: CrossPreviewPageContentProps) {
  const preview = useCrossPreview(cross)

  return (
    <div className={classes.root}>
      <CrossPreviewTopBar
        activeTab={preview.activeTab}
        onOpenIntimationModal={preview.openIntimationModal}
        onUpdateTab={preview.updateTab}
      />
      <CrossPreviewHeaderCard cross={cross} />

      {preview.isPlanilla ? (
        <CrossPreviewPlanSection
          columns={preview.planillaColumns}
          cross={cross}
          error={preview.planillaError}
          isLoading={preview.planillaIsLoading}
          onSetPage={preview.setPlanillaPage}
          onSetPlanillaSearch={preview.setPlanillaSearch}
          pagination={preview.planillaPagination}
          planillaSearch={preview.planillaSearch}
          rows={preview.planillaRows}
        />
      ) : (
        <CrossPreviewResumenSection
          analysisColumns={preview.analysisColumns}
          columnFilters={preview.columnFilters}
          cross={cross}
          error={preview.resumenError}
          isLoading={preview.resumenIsLoading}
          onOpenFilterModal={preview.openFilterModal}
          onSetPage={preview.setResumenPage}
          onRequestStatusChange={preview.requestAnalysisStatusChange}
          onSetResumenSearch={preview.setResumenSearch}
          pagination={preview.resumenPagination}
          resumenSearch={preview.resumenSearch}
          rows={preview.resumenRows}
          statusByCuit={preview.statusByCuit}
          summaryBlocks={preview.summaryBlocks}
        />
      )}

      <CrossFilterModal
        key={preview.activeFilterColumn?.key ?? 'closed'}
        allowedOperators={preview.activeFilterColumn?.allowedOperators ?? []}
        columnKey={preview.activeFilterColumn?.key ?? null}
        columnLabel={preview.activeFilterColumn?.label ?? ''}
        columnType={preview.activeFilterColumn?.type ?? 'numero'}
        error={preview.resumenError}
        initialValue={
          preview.activeFilterColumn
            ? preview.columnFilters[preview.activeFilterColumn.key] ?? null
            : null
        }
        isPending={preview.resumenIsLoading}
        onApply={preview.applyFilter}
        onClear={preview.clearFilter}
        onClose={preview.closeFilterModal}
        opened={Boolean(preview.activeFilterColumn)}
      />

      <CrossPreviewModals
        activePreviewIndex={preview.activePreviewIndex}
        contributors={preview.planillaRows}
        exportModalOpened={preview.exportModalOpened}
        intimationModalOpened={preview.intimationModalOpened}
        onCloseExportModal={preview.closeExportModal}
        onCloseIntimationModal={preview.closeIntimationModal}
        onCloseReprocessingModal={preview.closeReprocessingModal}
        onConfirmReprocessingModal={preview.confirmReprocessingModal}
        onGoToNextPreview={preview.goToNextPreview}
        onGoToPreviousPreview={preview.goToPreviousPreview}
        onOpenExportModal={preview.openExportModal}
        pendingReprocessingRow={preview.pendingReprocessingRow}
      />
    </div>
  )
}
