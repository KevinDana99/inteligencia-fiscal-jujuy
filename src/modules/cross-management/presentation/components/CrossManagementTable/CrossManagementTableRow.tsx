'use client'

import { Badge, Table } from '@mantine/core'
import type {
  ICrossManagementItem
} from '../../../data/models/CrossManagement'
import { useCrossManagementTableRow } from '../../hooks/cross-management/useCrossManagementTableRow'
import classes from './CrossManagementTableRow.module.css'

interface CrossManagementTableRowProps {
  item: ICrossManagementItem
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

export function CrossManagementTableRow({
  item,
  onOpenCrossPreview
}: CrossManagementTableRowProps) {
  const { handleOpenCrossPreview, sourceBadgeClassName } =
    useCrossManagementTableRow({
      item,
      onOpenCrossPreview
    })

  return (
    <Table.Tr className={classes.row} onClick={handleOpenCrossPreview}>
      <Table.Td className={classes.nameCell}>{item.name}</Table.Td>
      <Table.Td>
        <Badge
          radius="xl"
          classNames={{ label: classes.sourceBadgeLabel }}
          className={sourceBadgeClassName}
        >
          {item.source}
        </Badge>
      </Table.Td>
      <Table.Td className={classes.sourceRefCell}>{item.sourceRef}</Table.Td>
      <Table.Td className={classes.mutedCell}>{item.period}</Table.Td>
      <Table.Td className={classes.countCell}>{item.cuitCount}</Table.Td>
      <Table.Td className={classes.mutedCell}>{item.date}</Table.Td>
    </Table.Tr>
  )
}
