'use client'

import { ActionIcon, Badge, Table, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { REPROCESSING_PAGE_LABELS } from '../../../constants/reprocessingPageLabels'
import {
  useReprocessingPreviewNavigation,
  useReprocessingRemoveTrigger
} from '../../../hooks'
import type {
  IReprocessingItem,
  IReprocessingItems
} from '../../../../data/models/Reprocessing'
import classes from './ReprocessingTable.module.css'

interface ReprocessingTableProps {
  items: IReprocessingItems
  setPendingRemovalItem: (item: IReprocessingItem | null) => void
}

export function ReprocessingTable({
  items,
  setPendingRemovalItem
}: ReprocessingTableProps) {
  const {
    navigateToPreview,
    handlePreviewRowKeyDown
  } = useReprocessingPreviewNavigation()
  const { openRemoveModal } = useReprocessingRemoveTrigger({
    items,
    setPendingRemovalItem
  })

  return (
    <div className={classes.tableWrap}>
      <Table withTableBorder={false} withColumnBorders={false} className={classes.table}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>CUIT</Table.Th>
            <Table.Th>Razón Social</Table.Th>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Marcado por</Table.Th>
            <Table.Th>Último cruce</Table.Th>
            <Table.Th>Notas</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.length ? (
            items.map((item) => (
              <Table.Tr
                key={item.id}
                className={classes.row}
                onClick={() => navigateToPreview(item)}
                onKeyDown={(event) => handlePreviewRowKeyDown(event, item)}
                tabIndex={0}
                role="link"
                aria-label={`Ver padrón de ${item.businessName} (${item.cuit})`}
              >
                <Table.Td className={classes.cuitCell}>{item.cuit}</Table.Td>
                <Table.Td className={classes.nameCell}>{item.businessName}</Table.Td>
                <Table.Td className={classes.mutedCell}>{item.date}</Table.Td>
                <Table.Td className={classes.mutedCell}>{item.markedBy}</Table.Td>
                <Table.Td>
                  <Badge radius="xl" className={classes.crossBadge}>
                    {item.lastCross}
                  </Badge>
                </Table.Td>
                <Table.Td className={classes.notesCell}>{item.notes}</Table.Td>
                <Table.Td
                  className={classes.actionCell}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <ActionIcon
                    variant="subtle"
                    className={classes.removeButton}
                    onClick={() => openRemoveModal(item.id)}
                    aria-label={`Quitar ${item.cuit} de reproceso`}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text className={classes.emptyState}>{REPROCESSING_PAGE_LABELS.emptyState}</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  )
}
