'use client'

import type { ICrossPreviewData } from '../../../data/models/CrossManagement'
import { useCrossPreview } from '../../hooks'
import { CrossPreviewHeaderCard } from './CrossPreviewHeaderCard'
import { CrossPreviewModals } from './CrossPreviewModals'
import { CrossPreviewPlanSection } from './CrossPreviewPlanSection'
import { CrossPreviewResumenSection } from './CrossPreviewResumenSection'
import { CrossPreviewTopBar } from './CrossPreviewTopBar'
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
          cross={cross}
          filteredPlanRows={preview.filteredPlanRows}
          onSetPlanillaSearch={preview.setPlanillaSearch}
          planillaSearch={preview.planillaSearch}
        />
      ) : (
        <CrossPreviewResumenSection
          columnFilters={preview.columnFilters}
          cross={cross}
          filteredAnalysisRows={preview.filteredAnalysisRows}
          onOpenFilterModal={preview.openFilterModal}
          onRequestStatusChange={preview.requestAnalysisStatusChange}
          onSetResumenSearch={preview.setResumenSearch}
          resumenSearch={preview.resumenSearch}
          statusByCuit={preview.statusByCuit}
        />
      )}

      <CrossPreviewModals
        activePreviewIndex={preview.activePreviewIndex}
        contributors={cross.planRows}
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
