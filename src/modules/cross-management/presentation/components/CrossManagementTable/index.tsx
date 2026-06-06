'use client'

import { Table, Text } from '@mantine/core'
import type {
  ICrossManagementItem,
  ICrossManagementItems
} from '../../../data/models/CrossManagement'
import { useCrossManagementTable } from '../../hooks/cross-management/useCrossManagementTable'
import { CrossManagementTableRow } from './CrossManagementTableRow'
import classes from './CrossManagementTable.module.css'

interface CrossManagementTableProps {
  items: ICrossManagementItems
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

export function CrossManagementTable({
  items,
  onOpenCrossPreview
}: CrossManagementTableProps) {
  const { columns, emptyMessage, shouldShowEmptyState } = useCrossManagementTable({
    items
  })

  return (
    <div className={classes.tableWrap}>
      <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column}>{column}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {shouldShowEmptyState ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text className={classes.emptyState}>{emptyMessage}</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            items.map((item) => (
              <CrossManagementTableRow
                key={item.id}
                item={item}
                onOpenCrossPreview={onOpenCrossPreview}
              />
            ))
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}
