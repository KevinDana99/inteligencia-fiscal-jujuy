'use client'

import { Fragment } from 'react'
import { Table } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { BatchManagementBatchDetail } from '../BatchManagementBatchDetail'
import { BatchManagementCrossMenu } from '../BatchManagementCrossMenu'
import classes from '../BatchManagementTable.module.css'

type BatchManagementTableRowProps = {
  row: ReturnType<typeof import('../useBatchManagementTable').useBatchManagementTable>['rows'][number]
}

export function BatchManagementTableRow({ row }: BatchManagementTableRowProps) {
  return (
    <Fragment key={row.id}>
      <Table.Tr
        className={`${classes.row} ${row.isExpanded ? classes.rowExpanded : ''}`}
        onClick={row.onToggle}
      >
        <Table.Td className={classes.chevronCell}>
          <span
            className={`${classes.chevron} ${row.isExpanded ? classes.chevronOpen : ''}`}
          >
            <IconChevronRight size={13} />
          </span>
        </Table.Td>
        <Table.Td className={`${classes.batchCell} ${classes.batchNumber}`}>
          {row.batch.batchNumber}
        </Table.Td>
        <Table.Td className={`${classes.batchCell} ${classes.batchName}`}>
          {row.batch.name}
        </Table.Td>
        <Table.Td className={`${classes.batchCell} ${classes.batchDescription}`}>
          {row.batch.description}
        </Table.Td>
        <Table.Td className={classes.cuitCountCell}>
          <span className={classes.cuitCountValue}>{row.batch.cuitCount}</span>
        </Table.Td>
        <Table.Td className={`${classes.batchCell} ${classes.batchDate}`}>
          {row.batch.createdAt}
        </Table.Td>
        <Table.Td onClick={(event) => event.stopPropagation()} className={classes.actionCell}>
          <BatchManagementCrossMenu controller={row.crossMenu} />
        </Table.Td>
      </Table.Tr>
      {row.isExpanded ? (
        <Table.Tr>
          <Table.Td colSpan={7} className={classes.detailCell}>
            <BatchManagementBatchDetail batch={row.batch} />
          </Table.Td>
        </Table.Tr>
      ) : null}
    </Fragment>
  )
}
