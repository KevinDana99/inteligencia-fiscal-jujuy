import { Table } from '@mantine/core'
import type {
  ICrossDynamicColumn,
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisStatusSelect } from './CrossPreviewAnalysisStatusSelect'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisRowProps {
  columns: ICrossDynamicColumn[]
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  row: ICrossPreviewAnalysisRow
  status: CrossPreviewStatus
}

export function CrossPreviewAnalysisRow({
  columns,
  onRequestStatusChange,
  row,
  status
}: CrossPreviewAnalysisRowProps) {
  return (
    <Table.Tr>
      {columns.map((column) => (
        <Table.Td
          key={`${row.id}-${column.key}`}
          className={`${classes.analysisBodyCell} ${
            column.key === 'cuit' ? classes.analysisBodyCellMonospace : ''
          } ${
            column.key === 'razonSocial' ? classes.analysisBodyCellLeft : ''
          }`}
        >
          {column.key === 'estadoRelevancia' ? (
            <div className={classes.statusCell}>
              <CrossPreviewAnalysisStatusSelect
                onRequestStatusChange={onRequestStatusChange}
                row={row}
                status={status}
              />
            </div>
          ) : (
            row.values[column.key] ?? '-'
          )}
        </Table.Td>
      ))}
    </Table.Tr>
  )
}
