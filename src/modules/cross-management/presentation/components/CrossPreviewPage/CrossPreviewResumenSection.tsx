import type {
  ICrossColumnFilters,
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewSummaryBlock
} from '../../../data/models/CrossManagement'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewResumenQuery'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisSection } from './CrossPreviewAnalysisSection'
import { CrossPreviewSummarySection } from './CrossPreviewSummarySection'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewResumenSectionProps {
  analysisColumns: ICrossDynamicColumn[]
  columnFilters: ICrossColumnFilters
  cross: ICrossPreviewData
  error?: string | null
  isLoading: boolean
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
  onSetPage: (page: number) => void
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  onSetResumenSearch: (value: string) => void
  pagination: ICrossPaginationData
  resumenSearch: string
  rows: ICrossPreviewAnalysisRow[]
  statusByCuit: Record<string, CrossPreviewStatus>
  summaryBlocks: ICrossPreviewSummaryBlock[]
}

export function CrossPreviewResumenSection({
  analysisColumns,
  columnFilters,
  cross,
  error,
  isLoading,
  onOpenFilterModal,
  onSetPage,
  onRequestStatusChange,
  onSetResumenSearch,
  pagination,
  resumenSearch,
  rows,
  statusByCuit,
  summaryBlocks
}: CrossPreviewResumenSectionProps) {
  return (
    <div className={classes.contentStack}>
      <CrossPreviewSummarySection
        cross={cross}
        summaryBlocks={summaryBlocks}
      />
      <CrossPreviewAnalysisSection
        analysisColumns={analysisColumns}
        columnFilters={columnFilters}
        error={error}
        isLoading={isLoading}
        onOpenFilterModal={onOpenFilterModal}
        onSetPage={onSetPage}
        onRequestStatusChange={onRequestStatusChange}
        onSetResumenSearch={onSetResumenSearch}
        pagination={pagination}
        resumenSearch={resumenSearch}
        rows={rows}
        statusByCuit={statusByCuit}
      />
    </div>
  )
}
