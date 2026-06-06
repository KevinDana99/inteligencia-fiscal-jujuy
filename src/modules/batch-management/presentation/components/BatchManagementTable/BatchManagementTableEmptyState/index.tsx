'use client'

import { Group, Table, Text } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import classes from '../BatchManagementTable.module.css'

export function BatchManagementTableEmptyState() {
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
          <Table.Tr>
            <Table.Td colSpan={7}>
              <Group gap="sm" py="md">
                <IconSearch size={16} className={classes.emptyStateIcon} />
                <Text className={classes.emptyState}>
                  No se encontraron resultados para la busqueda actual.
                </Text>
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  )
}
