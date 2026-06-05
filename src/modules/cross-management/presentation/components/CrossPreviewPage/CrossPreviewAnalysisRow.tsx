import { Table } from '@mantine/core'
import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisStatusSelect } from './CrossPreviewAnalysisStatusSelect'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisRowProps {
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  row: ICrossPreviewAnalysisRow
  status: CrossPreviewStatus
}

export function CrossPreviewAnalysisRow({
  onRequestStatusChange,
  row,
  status
}: CrossPreviewAnalysisRowProps) {
  return (
    <Table.Tr>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisBodyCellMonospace}`}>{row.cuit}</Table.Td>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisBodyCellLeft}`}>{row.businessName}</Table.Td>
      <Table.Td className={classes.analysisBodyCell}>{row.declaredBase}</Table.Td>
      <Table.Td className={classes.analysisBodyCell}>{row.pretendedBase}</Table.Td>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.difference}</Table.Td>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.tax}</Table.Td>
      <Table.Td className={`${classes.analysisBodyCell} ${classes.analysisDangerCell}`}>{row.netDebt}</Table.Td>
      <Table.Td className={classes.analysisBodyCell}>
        <div className={classes.statusCell}>
          <CrossPreviewAnalysisStatusSelect
            onRequestStatusChange={onRequestStatusChange}
            row={row}
            status={status}
          />
        </div>
      </Table.Td>
    </Table.Tr>
  )
}
