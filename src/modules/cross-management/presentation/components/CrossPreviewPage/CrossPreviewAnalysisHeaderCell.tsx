import { Table } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import type { ICrossColumnFilters } from '../../../data/models/CrossManagement'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewResumenQuery'
import { useCrossPreviewAnalysisHeaderCell } from '../../hooks/cross-preview/useCrossPreviewAnalysisHeaderCell'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisHeaderCellProps {
  column: CrossFilterColumnConfig
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

  const isLeftAligned = column.key === 'cuit' || column.key === 'razonSocial'

  return (
    <Table.Th
      key={column.key}
      className={`${classes.analysisHeaderCell} ${
        isLeftAligned ? classes.analysisHeaderCellLeft : ''
      }`}
    >
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
