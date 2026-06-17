'use client'

import { Group, Pagination, Select, Table, Text } from '@mantine/core'
import type { BatchManagementTableController } from '../../hooks/useBatchManagement'
import { BATCH_MANAGEMENT_ITEMS_PER_PAGE_OPTIONS } from '../../constants'
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
            <Table.Th>Creado por</Table.Th>
            <Table.Th className={classes.actionColumn} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {table.rows.map((row) => (
            <BatchManagementTableRow key={row.id} row={row} />
          ))}
        </Table.Tbody>
      </Table>
      <div className={classes.tableFooter}>
        <Text className={classes.tableResultsText}>{controller.rangeLabel}</Text>
        <Group gap="sm" className={classes.paginationControls}>
          <Select
            aria-label="Filas por pagina"
            value={String(controller.itemsPerPage)}
            data={BATCH_MANAGEMENT_ITEMS_PER_PAGE_OPTIONS.map((option) => ({
              value: String(option),
              label: String(option)
            }))}
            className={classes.pageSizeSelect}
            disabled={controller.isPending}
            onChange={(value) => {
              if (value) {
                controller.onItemsPerPageChange(Number(value))
              }
            }}
          />
          <Pagination
            value={controller.page}
            total={Math.max(controller.totalPages, 1)}
            disabled={controller.isPending || controller.totalPages <= 1}
            onChange={controller.onPageChange}
            aria-label="Paginacion de lotes"
          />
        </Group>
      </div>
    </div>
  )
}
