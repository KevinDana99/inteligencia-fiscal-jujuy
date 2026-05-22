'use client'

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { IconAlertCircle, IconSearch, IconX } from '@tabler/icons-react'
import { useReprocessing } from '../../hooks'
import classes from './ReprocessingPage.module.css'
import type { IReprocessingListData } from '../../../data/models/Reprocessing'

export function ReprocessingPage({
  initialData
}: {
  initialData: IReprocessingListData | null
}) {
  const {
    items,
    total,
    searchValue,
    pendingRemovalItem,
    isSearchPending,
    isRemovePending,
    setSearchValue,
    openInPadron,
    openRemoveModal,
    closeRemoveModal,
    confirmRemoveFromReprocessing
  } = useReprocessing(initialData)

  return (
    <div className={classes.root}>
      <div className={classes.alertCard}>
        <div className={classes.alertContent}>
          <div className={classes.alertTitle}>CUITs en reproceso</div>
          <div className={classes.alertDescription}>
            Contribuyentes pendientes de investigación profunda. Podés agregar
            CUITs desde el Padrón Unificado activando el switch.
          </div>
        </div>
        <span className={classes.alertBadge}>{total} en reproceso</span>
      </div>

      <div className={classes.searchRow}>
        <TextInput
          leftSection={<IconSearch size={16} />}
          placeholder="Buscar por CUIT o razón social..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          className={classes.searchInput}
          classNames={{
            input: classes.searchInputField,
            section: classes.searchInputSection
          }}
          rightSection={isSearchPending ? <IconSearch size={14} /> : null}
        />
      </div>

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
                  onClick={() => openInPadron(item.cuit)}
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
                  >
                    <ActionIcon
                      variant="subtle"
                      className={classes.removeButton}
                      onClick={() => openRemoveModal(item.id)}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text className={classes.emptyState}>
                    No se encontraron CUITs en reproceso
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      <Modal
        opened={Boolean(pendingRemovalItem)}
        onClose={closeRemoveModal}
        centered
        size={420}
        title={
          <Stack gap={4}>
            <Title order={2} className={classes.modalTitle}>
              Quitar de reproceso
            </Title>
            <Text className={classes.modalSubtitle}>
              ¿Confirmas que deseas quitar este CUIT del reproceso?
            </Text>
          </Stack>
        }
        classNames={{
          content: classes.modalContent,
          header: classes.modalHeader,
          body: classes.modalBody,
          close: classes.modalCloseButton,
          overlay: classes.modalOverlay
        }}
      >
        <div className={classes.modalAlertBox}>
          <IconAlertCircle size={18} className={classes.modalAlertIcon} />
          <Text className={classes.modalAlertText}>
            {pendingRemovalItem?.businessName ?? ''}
          </Text>
        </div>

        <Text className={classes.modalDescription}>
          El CUIT será removido de la lista de reproceso. Esta acción no afecta
          el historial de cruces.
        </Text>

        <Group justify="flex-end" gap="sm" className={classes.modalFooter}>
          <Button variant="default" className={classes.modalCancelButton} onClick={closeRemoveModal}>
            Cancelar
          </Button>
          <Button
            className={classes.modalConfirmButton}
            onClick={confirmRemoveFromReprocessing}
            loading={isRemovePending}
          >
            Sí, quitar
          </Button>
        </Group>
      </Modal>
    </div>
  )
}
