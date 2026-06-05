import { Badge, Card, Table, Text } from '@mantine/core'
import type {
  ICrossPreviewData,
  ICrossPreviewSummaryRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_SUMMARY_TAB_LABEL } from '../../constants/crossPreviewLabels'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewSummarySectionProps {
  cross: ICrossPreviewData
}

export function CrossPreviewSummarySection({ cross }: CrossPreviewSummarySectionProps) {
  return (
    <Card className={classes.tableCard} radius="lg" padding={0}>
      <div className={`${classes.tableToolbar} ${classes.tableToolbarCompact}`}>
        <Text className={classes.tableToolbarTitle}>
          {CROSS_PREVIEW_SUMMARY_TAB_LABEL}
        </Text>
        <Badge className={classes.toolbarBadge} radius="xl">
          {cross.cuitCount} CUITs - {cross.source === 'Lote' ? 'RÉGIMEN CM' : 'PADRÓN'}
        </Badge>
      </div>

      <div className={classes.simpleTableWrap}>
        <Table className={classes.summaryTable} withTableBorder={false} withColumnBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={`${classes.summaryHeaderCell} ${classes.summaryHeaderCellLeft}`}>RÉGIMEN</Table.Th>
              <Table.Th className={classes.summaryHeaderCell}>B.I. 910</Table.Th>
              <Table.Th className={classes.summaryHeaderCell}>B.I. PRETENDIDA</Table.Th>
              <Table.Th className={classes.summaryHeaderCell}>DIF A FAVOR DPR</Table.Th>
              <Table.Th className={classes.summaryHeaderCell}>IMPUESTO</Table.Th>
              <Table.Th className={classes.summaryHeaderCell}>DEUDA NETA</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {cross.summaryRows.map((row) => (
              <CrossPreviewSummaryRow key={row.regime} row={row} />
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Card>
  )
}

function CrossPreviewSummaryRow({ row }: { row: ICrossPreviewSummaryRow }) {
  return (
    <Table.Tr>
      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryBodyCellLeft}`}>{row.regime}</Table.Td>
      <Table.Td className={classes.summaryBodyCell}>{row.declaredBase}</Table.Td>
      <Table.Td className={classes.summaryBodyCell}>{row.pretendedBase}</Table.Td>
      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.difference}</Table.Td>
      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.tax}</Table.Td>
      <Table.Td className={`${classes.summaryBodyCell} ${classes.summaryDangerCell}`}>{row.netDebt}</Table.Td>
    </Table.Tr>
  )
}
