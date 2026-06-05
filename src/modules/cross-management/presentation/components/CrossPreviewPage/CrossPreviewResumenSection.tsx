import type {
  ICrossColumnFilters,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData
} from '../../../data/models/CrossManagement'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewAnalysisFilters'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisSection } from './CrossPreviewAnalysisSection'
import { CrossPreviewSummarySection } from './CrossPreviewSummarySection'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewResumenSectionProps {
  columnFilters: ICrossColumnFilters
  cross: ICrossPreviewData
  filteredAnalysisRows: ICrossPreviewAnalysisRow[]
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  onSetResumenSearch: (value: string) => void
  resumenSearch: string
  statusByCuit: Record<string, CrossPreviewStatus>
}

export function CrossPreviewResumenSection({
  columnFilters,
  cross,
  filteredAnalysisRows,
  onOpenFilterModal,
  onRequestStatusChange,
  onSetResumenSearch,
  resumenSearch,
  statusByCuit
}: CrossPreviewResumenSectionProps) {
  return (
    <div className={classes.contentStack}>
      <CrossPreviewSummarySection cross={cross} />
      <CrossPreviewAnalysisSection
        columnFilters={columnFilters}
        filteredAnalysisRows={filteredAnalysisRows}
        onOpenFilterModal={onOpenFilterModal}
        onRequestStatusChange={onRequestStatusChange}
        onSetResumenSearch={onSetResumenSearch}
        resumenSearch={resumenSearch}
        statusByCuit={statusByCuit}
      />
    </div>
  )
}
