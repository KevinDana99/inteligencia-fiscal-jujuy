'use client'

import { Badge, Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { IconAlertTriangleFilled, IconCheck } from '@tabler/icons-react'
import type { IBatchPreviewData } from '../../../../data/models/BatchManagement'
import { BatchImportPreviewTable } from './BatchImportPreviewTable'
import { useBatchImportPreviewModal } from './useBatchImportPreviewModal'
import classes from './BatchImportPreviewModal.module.css'

type BatchImportPreviewModalProps = {
  opened: boolean
  previewData: IBatchPreviewData | null
  onClose: () => void
  onConfirm: (acceptedNormalizedCuits?: string[]) => void
}

export function BatchImportPreviewModal({
  opened,
  previewData,
  onClose,
  onConfirm
}: BatchImportPreviewModalProps) {
  const preview = useBatchImportPreviewModal({
    previewData,
    onConfirm
  })

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size={620}
      title={
        <Stack gap={4}>
          <Title order={2} className={classes.title}>
            Vista previa — Importación Excel
          </Title>
          <Text className={classes.description}>
            {previewData?.fileName ?? 'archivo.xlsx'} · {previewData?.foundRecords ?? 0}{' '}
            registros encontrados
          </Text>
        </Stack>
      }
      classNames={{
        content: classes.content,
        header: classes.header,
        body: classes.body,
        close: classes.closeButton,
        overlay: classes.overlay
      }}
    >
      <Stack gap={0} className={classes.previewContent}>
        <Group gap="xs" className={classes.previewStatusRow}>
          <Badge radius="xl" className={classes.validSummaryBadge}>
            ✓ {preview.validCount} válidos
          </Badge>
          <Badge radius="xl" className={classes.invalidSummaryBadge}>
            ✕ {preview.invalidCount} inválido
          </Badge>
        </Group>

        <BatchImportPreviewTable rows={preview.rows} />

        <Group gap="xs" className={classes.previewAlert}>
          <IconAlertTriangleFilled size={16} className={classes.previewAlertIcon} />
          <Text className={classes.previewAlertText}>
            Los CUITs inválidos serán ignorados salvo que elijas una sugerencia. Se
            importarán <span className={classes.previewAlertStrong}>{preview.importCount} CUITs</span>.
          </Text>
        </Group>
      </Stack>

      <Group justify="flex-end" gap="sm" className={classes.footer}>
        <Button variant="default" className={classes.cancelButton} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          className={classes.submitButtonActive}
          leftSection={<IconCheck size={14} />}
          onClick={preview.handleConfirm}
        >
          Confirmar importación ({preview.importCount} CUITs)
        </Button>
      </Group>
    </Modal>
  )
}
