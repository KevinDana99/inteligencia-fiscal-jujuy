import type {
  ICrossColumnFilters,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewResumenSection
} from '../../../data/models/CrossManagement'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewResumenQuery'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisSection } from './CrossPreviewAnalysisSection'
import { CrossPreviewSummarySection } from './CrossPreviewSummarySection'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewResumenSectionProps {
  cross: ICrossPreviewData
  error?: string | null
  gridStateBySection: Record<
    string,
    {
      columnFilters: ICrossColumnFilters
      search: string
    }
  >
  loadingSectionKey: string | null
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  onSetSectionPage: (sectionKey: string, page: number) => void
  onSetSectionSearch: (sectionKey: string, value: string) => void
  sections: ICrossPreviewResumenSection[]
  statusByCuit: Record<string, CrossPreviewStatus>
}

export function CrossPreviewResumenSection({
  cross,
  error,
  gridStateBySection,
  loadingSectionKey,
  onOpenFilterModal,
  onRequestStatusChange,
  onSetSectionPage,
  onSetSectionSearch,
  sections,
  statusByCuit
}: CrossPreviewResumenSectionProps) {
  return (
    <div className={classes.contentStack}>
      {sections.map((section) => {
        if (section.type === 'resumen') {
          return (
            <CrossPreviewSummarySection
              key={section.id}
              cross={cross}
              summaryBlocks={[section]}
            />
          )
        }

        const sectionState = gridStateBySection[section.id] ?? {
          columnFilters: {},
          search: ''
        }

        return (
          <CrossPreviewAnalysisSection
            key={section.id}
            analysisColumns={section.columns}
            columnFilters={sectionState.columnFilters}
            error={loadingSectionKey === section.id ? null : error}
            isLoading={loadingSectionKey === section.id}
            onOpenFilterModal={onOpenFilterModal}
            onSetPage={(page) => onSetSectionPage(section.id, page)}
            onRequestStatusChange={onRequestStatusChange}
            onSetResumenSearch={(value) =>
              onSetSectionSearch(section.id, value)
            }
            pagination={section.pagination}
            resumenSearch={sectionState.search}
            rows={section.rows}
            sectionKey={section.id}
            statusByCuit={statusByCuit}
            title={section.title}
          />
        )
      })}
    </div>
  )
}
