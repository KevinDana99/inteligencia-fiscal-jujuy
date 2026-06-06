'use client'

import { Table } from '@mantine/core'
import type { BatchManagementTableController } from '../../hooks/useBatchManagement'
import { BatchManagementTableEmptyState } from './BatchManagementTableEmptyState'
import { BatchManagementTableRow } from './BatchManagementTableRow'
import { useBatchManagementTable } from './useBatchManagementTable'
import classes from './BatchManagementTable.module.css'

type BatchManagementTableProps = {
  controller: BatchManagementTableController
}

export function BatchManagementTable({ controller }: BatchManagementTableProps) {
  const table = useBatchManagementTable(controller)

  if (table.isEmpty) {
    return <BatchManagementTableEmptyState />
  }

  return (
    <div className={classes.tableWrap}>
      <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={classes.chevronColumn} />
            <Table.Th className={classes.batchNumberHeader}>Nro de lote</Table.Th>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th>
              <span className={classes.cuitCountHeader}>Cantidad de CUITs</span>
            </Table.Th>
            <Table.Th>Fecha de generación</Table.Th>
            <Table.Th className={classes.actionColumn} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {table.rows.map((row) => (
            <BatchManagementTableRow key={row.id} row={row} />
          ))}
        </Table.Tbody>
      </Table>
    </div>
  )
}
