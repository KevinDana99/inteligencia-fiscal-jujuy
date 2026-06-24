'use client'

import { Group, Skeleton, Stack, Table } from '@mantine/core'
import tableClasses from '../BatchManagementTable.module.css'
import classes from './BatchManagementBatchDetail.module.css'

type BatchManagementBatchDetailSkeletonProps = {
  rowCount: number
}

export function BatchManagementBatchDetailSkeleton({
  rowCount
}: BatchManagementBatchDetailSkeletonProps) {
  const rows = Array.from({ length: Math.max(1, rowCount) }, (_, index) => index)

  return (
    <div className={classes.detailInner} aria-label="Cargando CUITs del lote">
      <Stack gap="sm">
        <Skeleton height={13} width={240} radius="sm" />

        <Table
          withTableBorder={false}
          withColumnBorders={false}
          className={`${tableClasses.table} ${classes.nestedTable}`}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>CUIT</Table.Th>
              <Table.Th>Razon Social</Table.Th>
              <Table.Th>Tipo de contribuyente</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={`batch-detail-skeleton-${row}`}>
                <Table.Td className={classes.batchDate}>
                  <Skeleton height={14} width="100%" radius="sm" />
                </Table.Td>
                <Table.Td className={classes.monoText}>
                  <Skeleton height={14} width="100%" radius="sm" />
                </Table.Td>
                <Table.Td>
                  <Skeleton height={14} width="100%" radius="sm" />
                </Table.Td>
                <Table.Td>
                  <Skeleton height={20} width="100%" radius="xl" />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <div className={classes.detailFooter}>
          <Skeleton height={13} width={190} radius="sm" />
          <Group gap="sm" className={classes.detailPaginationControls}>
            <Skeleton height={36} width={76} radius="sm" />
            <Skeleton height={32} width={170} radius="sm" />
          </Group>
        </div>
      </Stack>
    </div>
  )
}
