'use client'

import { Skeleton, Table } from '@mantine/core'
import classes from './BatchManagementTable.module.css'

type BatchManagementTableSkeletonRowsProps = {
  rowCount: number
}

export function BatchManagementTableSkeletonRows({
  rowCount
}: BatchManagementTableSkeletonRowsProps) {
  const rows = Array.from({ length: Math.max(1, rowCount) }, (_, index) => index)

  return (
    <>
      {rows.map((row) => (
        <Table.Tr key={`batch-table-skeleton-${row}`} className={classes.skeletonRow}>
          <Table.Td className={classes.chevronCell}>
            <Skeleton height={14} width={14} radius="sm" />
          </Table.Td>
          <Table.Td className={`${classes.batchCell} ${classes.batchNumber}`}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={`${classes.batchCell} ${classes.batchName}`}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={`${classes.batchCell} ${classes.batchDescription}`}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={classes.cuitCountCell}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={`${classes.batchCell} ${classes.batchDate}`}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={`${classes.batchCell} ${classes.batchAuthor}`}>
            <Skeleton height={14} width="100%" radius="sm" />
          </Table.Td>
          <Table.Td className={classes.actionCell}>
            <Skeleton height={20} width={20} radius="sm" />
          </Table.Td>
        </Table.Tr>
      ))}
    </>
  )
}
