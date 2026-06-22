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
  rank: number
  row: ICrossPreviewAnalysisRow
  status: CrossPreviewStatus
}

export function CrossPreviewAnalysisRow({
  columns,
  onRequestStatusChange,
  rank,
  row,
  status
}: CrossPreviewAnalysisRowProps) {
  return (
    <Table.Tr>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisRankCell}`}>
        <span
          className={`${classes.rankBadge} ${
            rank === 1 ? classes.rankBadgeFirst : classes.rankBadgeDefault
          }`}
        >
          {rank}°
        </span>
      </Table.Td>
      {columns.map((column) => (
        <Table.Td
          key={`${row.id}-${column.key}`}
          className={`${classes.analysisBodyCell} ${
            column.key === 'cuit' ? classes.analysisBodyCellMonospace : ''
          } ${
            column.key === 'razonSocial' ? classes.analysisBodyCellLeft : ''
          } ${
            column.key === 'estadoRelevancia'
              ? classes.analysisStatusBodyCell
              : ''
          } ${
            isAnalysisDangerColumn(column.key) ? classes.analysisDangerCell : ''
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
            formatAnalysisCellValue(column, row.values[column.key] ?? '-')
          )}
        </Table.Td>
      ))}
    </Table.Tr>
  )
}

function isAnalysisDangerColumn(columnKey: string) {
  return columnKey === 'diferencia' || columnKey === 'netoAPagar'
}

function formatAnalysisCellValue(column: ICrossDynamicColumn, value: string) {
  if (column.type !== 'numero') {
    return value
  }

  const normalizedValue = value.trim()

  if (!normalizedValue || normalizedValue === '-') {
    return '-'
  }

  if (/^[+-]?\$/.test(normalizedValue)) {
    return normalizedValue
  }

  if (normalizedValue.startsWith('-')) {
    return `-$ ${normalizedValue.slice(1).trim()}`
  }

  if (normalizedValue.startsWith('+')) {
    return `$ ${normalizedValue.slice(1).trim()}`
  }

  return `$ ${normalizedValue}`
}
