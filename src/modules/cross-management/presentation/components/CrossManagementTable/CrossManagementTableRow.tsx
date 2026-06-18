'use client'

import { Badge, Table } from '@mantine/core'
import { IconCheck, IconClock, IconX } from '@tabler/icons-react'
import type {
  ICrossManagementItem
} from '../../../data/models/CrossManagement'
import { useCrossManagementTableRow } from '../../hooks/cross-management/useCrossManagementTableRow'
import classes from './CrossManagementTableRow.module.css'

interface CrossManagementTableRowProps {
  item: ICrossManagementItem
  onOpenCrossPreview: (item: ICrossManagementItem) => void
}

const STATUS_ICON_BY_NAME = {
  check: IconCheck,
  clock: IconClock,
  x: IconX
}

export function CrossManagementTableRow({
  item,
  onOpenCrossPreview
}: CrossManagementTableRowProps) {
  const {
    handleOpenCrossPreview,
    sourceBadgeClassName,
    statusBadgeClassName,
    statusIcon,
    statusLabel
  } = useCrossManagementTableRow({
    item,
    onOpenCrossPreview
  })
  const StatusIcon = statusIcon ? STATUS_ICON_BY_NAME[statusIcon] : null

  return (
    <Table.Tr className={classes.row} onClick={handleOpenCrossPreview}>
      <Table.Td className={classes.nameCell}>{item.name}</Table.Td>
      <Table.Td>
        <Badge
          radius="xl"
          classNames={{
            label: classes.statusBadgeLabel,
            section: classes.statusBadgeSection
          }}
          className={statusBadgeClassName}
          leftSection={
            StatusIcon ? (
              <StatusIcon aria-hidden="true" size={12} stroke={2.4} />
            ) : undefined
          }
        >
          {statusLabel}
        </Badge>
      </Table.Td>
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
