import { Table, Text } from '@mantine/core'
import type {
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE } from '../../constants/crossPreviewLabels'
import { CROSS_PREVIEW_PLAN_COLUMN_GROUPS } from '../../constants/crossPreviewPlanTable'
import {
  useCrossPreviewPlanBodyCell,
  useCrossPreviewPlanGroupHeaderCell,
  useCrossPreviewPlanHeaderCell
} from '../../hooks/cross-preview/useCrossPreviewPlanTableClassNames'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPlanTableProps {
  columns: string[]
  rows: ICrossPreviewPlanRow[]
}

export function CrossPreviewPlanTable({
  columns,
  rows
}: CrossPreviewPlanTableProps) {
  return (
    <div className={classes.tableWrap}>
      <Table className={classes.planTable} withTableBorder={false} withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {CROSS_PREVIEW_PLAN_COLUMN_GROUPS.map((group) => (
              <CrossPreviewPlanGroupHeaderCell key={group.label} group={group} />
            ))}
          </Table.Tr>
          <Table.Tr>
            {columns.map((column) => (
              <CrossPreviewPlanHeaderCell key={column} column={column} />
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length ? (
            rows.map((row) => <CrossPreviewPlanRow key={row.id} row={row} />)
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

interface CrossPreviewPlanGroupHeaderCellProps {
  group: (typeof CROSS_PREVIEW_PLAN_COLUMN_GROUPS)[number]
}

function CrossPreviewPlanGroupHeaderCell({
  group
}: CrossPreviewPlanGroupHeaderCellProps) {
  const { className } = useCrossPreviewPlanGroupHeaderCell({
    groupClassName: group.className
  })

  return (
    <Table.Th colSpan={group.span} className={className}>
      {group.label}
    </Table.Th>
  )
}

function CrossPreviewPlanHeaderCell({ column }: { column: string }) {
  const { className } = useCrossPreviewPlanHeaderCell(column)

  return <Table.Th className={className}>{column}</Table.Th>
}

function CrossPreviewPlanRow({ row }: { row: ICrossPreviewPlanRow }) {
  return (
    <Table.Tr>
      {row.cells.map((cell, index) => (
        <CrossPreviewPlanBodyCell
          key={`${row.id}-${index}`}
          cell={cell}
          index={index}
        />
      ))}
    </Table.Tr>
  )
}

function CrossPreviewPlanBodyCell({
  cell,
  index
}: {
  cell: string
  index: number
}) {
  const { className } = useCrossPreviewPlanBodyCell(index)

  return <Table.Td className={className}>{cell}</Table.Td>
}
