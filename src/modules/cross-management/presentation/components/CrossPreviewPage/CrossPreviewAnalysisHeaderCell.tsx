import { Table } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import type { ICrossColumnFilters } from '../../../data/models/CrossManagement'
import type {
  CrossPreviewAnalysisFilterColumn
} from '../../constants/crossPreviewFilters'
import { useCrossPreviewAnalysisHeaderCell } from '../../hooks/cross-preview/useCrossPreviewAnalysisHeaderCell'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewAnalysisFilters'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisHeaderCellProps {
  column: CrossPreviewAnalysisFilterColumn
  columnFilters: ICrossColumnFilters
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
}

export function CrossPreviewAnalysisHeaderCell({
  column,
  columnFilters,
  onOpenFilterModal
}: CrossPreviewAnalysisHeaderCellProps) {
  const { className, handleOpenFilterModal } = useCrossPreviewAnalysisHeaderCell({
    column,
    columnFilters,
    onOpenFilterModal
  })

  return (
    <Table.Th key={column.key} className={classes.analysisHeaderCell}>
      <button
        type="button"
        className={className}
        onClick={handleOpenFilterModal}
      >
        <span>{column.label}</span>
        <IconChevronDown size={12} stroke={2.2} />
      </button>
    </Table.Th>
  )
}
