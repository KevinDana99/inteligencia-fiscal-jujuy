import { LoadingOverlay, Table, Text } from '@mantine/core'
import type {
  ICrossDynamicColumn,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE } from '../../constants/crossPreviewLabels'
import {
  useCrossPreviewPlanBodyCell,
  useCrossPreviewPlanHeaderCell
} from '../../hooks/cross-preview/useCrossPreviewPlanTableClassNames'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPlanTableProps {
  columns: ICrossDynamicColumn[]
  isLoading?: boolean
  rows: ICrossPreviewPlanRow[]
}

export function CrossPreviewPlanTable({
  columns,
  isLoading,
  rows
}: CrossPreviewPlanTableProps) {
  return (
    <div className={classes.tableWrap}>
      <LoadingOverlay
        visible={Boolean(isLoading)}
        zIndex={2}
        overlayProps={{ radius: 'sm', blur: 1 }}
      />
      <Table className={classes.planTable} withTableBorder={false} withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <CrossPreviewPlanHeaderCell key={column.key} column={column} />
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length ? (
            rows.map((row) => (
              <CrossPreviewPlanRow
                key={row.id}
                columns={columns}
                row={row}
              />
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text className={classes.emptyStateText}>
                  {CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE}
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}

function CrossPreviewPlanHeaderCell({
  column
}: {
  column: ICrossDynamicColumn
}) {
  const { className } = useCrossPreviewPlanHeaderCell(column)

  return <Table.Th className={className}>{column.label}</Table.Th>
}

function CrossPreviewPlanRow({
  columns,
  row
}: {
  columns: ICrossDynamicColumn[]
  row: ICrossPreviewPlanRow
}) {
  return (
    <Table.Tr>
      {columns.map((column) => (
        <CrossPreviewPlanBodyCell
          key={`${row.id}-${column.key}`}
          cell={row.values[column.key] ?? '-'}
          column={column}
        />
      ))}
    </Table.Tr>
  )
}

function CrossPreviewPlanBodyCell({
  cell,
  column
}: {
  cell: string
  column: ICrossDynamicColumn
}) {
  const { className } = useCrossPreviewPlanBodyCell(column)

  return <Table.Td className={className}>{cell}</Table.Td>
}
