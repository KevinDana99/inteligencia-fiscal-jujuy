import { Badge, Card, Table, Text } from '@mantine/core'
import type {
  ICrossPreviewData,
  ICrossPreviewSummaryBlock,
  ICrossPreviewSummaryRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_SUMMARY_TAB_LABEL } from '../../constants/crossPreviewLabels'
import classes from './CrossPreviewPage.module.css'

const SUMMARY_MONEY_KEYS = new Set([
  'bi910',
  'ingresosBrutos',
  'biPretendida',
  'mayorBaseImponible',
  'diferenciaAFavorDpr',
  'impuesto',
  'deudaNeta'
])

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
              {cross.cuitCount} CUITs · {resolveCrossRegimeLabel(cross)}
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
  const isNoteRow = isSummaryNoteRow(block, row)

  if (isNoteRow) {
    const note = row.values[block.columns[0]?.key ?? ''] ?? '-'

    return (
      <Table.Tr className={classes.summaryNoteRow}>
        <Table.Td className={classes.summaryNoteCell} colSpan={block.columns.length}>
          {note}
        </Table.Td>
      </Table.Tr>
    )
  }

  return (
    <Table.Tr>
      {block.columns.map((column, index) => (
        <Table.Td
          key={`${row.id}-${column.key}`}
          className={`${classes.summaryBodyCell} ${
            index === 0 ? classes.summaryBodyCellLeft : ''
          } ${
            isSummaryDangerColumn(column.key) ? classes.summaryDangerCell : ''
          }`}
        >
          {formatSummaryCellValue(column.key, row.values[column.key] ?? '-')}
        </Table.Td>
      ))}
    </Table.Tr>
  )
}

function resolveCrossRegimeLabel(cross: ICrossPreviewData) {
  const normalizedName = cross.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (normalizedName.includes('regimen general')) {
    return 'RÉGIMEN GENERAL'
  }

  if (normalizedName.includes('regimen cm')) {
    return 'RÉGIMEN CM'
  }

  return cross.source === 'Lote' ? 'RÉGIMEN GENERAL' : 'PADRÓN'
}

function isSummaryNoteRow(
  block: ICrossPreviewSummaryBlock,
  row: ICrossPreviewSummaryRow
) {
  return block.columns
    .slice(1)
    .every((column) => (row.values[column.key] ?? '-') === '-')
}

function isSummaryDangerColumn(columnKey: string) {
  return (
    columnKey.toLowerCase().includes('diferencia') ||
    columnKey.toLowerCase().includes('impuesto') ||
    columnKey.toLowerCase().includes('deuda')
  )
}

function formatSummaryCellValue(columnKey: string, value: string) {
  if (!SUMMARY_MONEY_KEYS.has(columnKey)) {
    return value
  }

  return formatMoneyValue(value)
}

function formatMoneyValue(value: string) {
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
