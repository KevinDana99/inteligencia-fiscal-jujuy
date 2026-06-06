import { Badge, Card, Table, Text } from '@mantine/core'
import type {
  ICrossPreviewData,
  ICrossPreviewSummaryBlock,
  ICrossPreviewSummaryRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_SUMMARY_TAB_LABEL } from '../../constants/crossPreviewLabels'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewSummarySectionProps {
  cross: ICrossPreviewData
  summaryBlocks: ICrossPreviewSummaryBlock[]
}

export function CrossPreviewSummarySection({
  cross,
  summaryBlocks
}: CrossPreviewSummarySectionProps) {
  return (
    <>
      {summaryBlocks.map((block) => (
        <Card key={block.id} className={classes.tableCard} radius="lg" padding={0}>
          <div className={`${classes.tableToolbar} ${classes.tableToolbarCompact}`}>
            <Text className={classes.tableToolbarTitle}>
              {block.title || CROSS_PREVIEW_SUMMARY_TAB_LABEL}
            </Text>
            <Badge className={classes.toolbarBadge} radius="xl">
              {cross.cuitCount} CUITs - {cross.source === 'Lote' ? 'RÉGIMEN CM' : 'PADRÓN'}
            </Badge>
          </div>

          <div className={classes.simpleTableWrap}>
            <Table className={classes.summaryTable} withTableBorder={false} withColumnBorders={false}>
              <Table.Thead>
                <Table.Tr>
                  {block.columns.map((column, index) => (
                    <Table.Th
                      key={column.key}
                      className={`${classes.summaryHeaderCell} ${
                        index === 0 ? classes.summaryHeaderCellLeft : ''
                      }`}
                    >
                      {column.label}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {block.rows.map((row) => (
                  <CrossPreviewSummaryRow
                    key={row.id}
                    block={block}
                    row={row}
                  />
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </Card>
      ))}
    </>
  )
}

function CrossPreviewSummaryRow({
  block,
  row
}: {
  block: ICrossPreviewSummaryBlock
  row: ICrossPreviewSummaryRow
}) {
  return (
    <Table.Tr>
      {block.columns.map((column, index) => (
        <Table.Td
          key={`${row.id}-${column.key}`}
          className={`${classes.summaryBodyCell} ${
            index === 0 ? classes.summaryBodyCellLeft : ''
          }`}
        >
          {row.values[column.key] ?? '-'}
        </Table.Td>
      ))}
    </Table.Tr>
  )
}
