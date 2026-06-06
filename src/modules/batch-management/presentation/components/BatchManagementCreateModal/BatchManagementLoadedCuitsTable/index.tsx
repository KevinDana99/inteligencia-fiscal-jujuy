'use client'

import { ActionIcon, Table } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { BatchManagementCreateModalViewModel } from '../useBatchManagementCreateModal'
import classes from './BatchManagementLoadedCuitsTable.module.css'

type BatchManagementLoadedCuitsTableProps = {
  rows: BatchManagementCreateModalViewModel['loadedCuits']['rows']
}

export function BatchManagementLoadedCuitsTable({
  rows
}: BatchManagementLoadedCuitsTableProps) {
  return (
    <div className={classes.cuitTableContainer}>
      <Table withTableBorder={false} withColumnBorders={false} className={classes.cuitTable}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>CUIT</Table.Th>
            <Table.Th>Razón Social</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length ? (
            rows.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.order}</Table.Td>
                <Table.Td className={classes.tableMonoText}>{row.cuit}</Table.Td>
                <Table.Td>{row.businessName}</Table.Td>
                <Table.Td className={classes.removeColumn}>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    className={classes.removeButton}
                    onClick={row.onRemove}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={4} className={classes.emptyTableCell}>
                Agregá CUITs usando el campo de arriba o importando un Excel.
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}
