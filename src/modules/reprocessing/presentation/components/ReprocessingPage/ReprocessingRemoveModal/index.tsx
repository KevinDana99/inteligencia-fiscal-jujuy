'use client'

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { REPROCESSING_PAGE_LABELS } from '../../../constants/reprocessingPageLabels'
import { useReprocessingRemoveModal } from '../../../hooks'
import type { IReprocessingItem } from '../../../../data/models/Reprocessing'
import classes from './ReprocessingRemoveModal.module.css'

interface ReprocessingRemoveModalProps {
  pendingRemovalItem: IReprocessingItem | null
  setPendingRemovalItem: (item: IReprocessingItem | null) => void
  onRemoved: (itemId: string) => void
}

export function ReprocessingRemoveModal({
  pendingRemovalItem,
  setPendingRemovalItem,
  onRemoved
}: ReprocessingRemoveModalProps) {
  const {
    isRemovePending,
    closeRemoveModal,
    confirmRemoveFromReprocessing
  } = useReprocessingRemoveModal({
    pendingRemovalItem,
    setPendingRemovalItem,
    onRemoved
  })

  return (
    <Modal
      opened={Boolean(pendingRemovalItem)}
      onClose={closeRemoveModal}
      centered
      size={420}
      title={
        <Stack gap={4}>
          <Title order={2} className={classes.modalTitle}>
            {REPROCESSING_PAGE_LABELS.removeModalTitle}
          </Title>
          <Text className={classes.modalSubtitle}>
            {REPROCESSING_PAGE_LABELS.removeModalSubtitle}
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
        {REPROCESSING_PAGE_LABELS.removeModalDescription}
      </Text>

      <Group justify="flex-end" gap="sm" className={classes.modalFooter}>
        <Button
          variant="default"
          className={classes.modalCancelButton}
          onClick={closeRemoveModal}
        >
          {REPROCESSING_PAGE_LABELS.cancelAction}
        </Button>
        <Button
          className={classes.modalConfirmButton}
          onClick={confirmRemoveFromReprocessing}
          loading={isRemovePending}
        >
          {REPROCESSING_PAGE_LABELS.confirmRemoveAction}
        </Button>
      </Group>
    </Modal>
  )
}
