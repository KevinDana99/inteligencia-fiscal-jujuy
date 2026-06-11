'use client'

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import type { BatchManagementCreateModalController } from '../../hooks/useBatchManagement'
import { BatchImportPreviewModal } from './BatchImportPreviewModal'
import { BatchManagementCreateFormFields } from './BatchManagementCreateFormFields'
import { BatchManagementLoadedCuitsSection } from './BatchManagementLoadedCuitsSection'
import { useBatchManagementCreateModal } from './useBatchManagementCreateModal'
import classes from './BatchManagementCreateModal.module.css'

type BatchManagementCreateModalProps = {
  controller: BatchManagementCreateModalController
}

export function BatchManagementCreateModal({
  controller
}: BatchManagementCreateModalProps) {
  const modal = useBatchManagementCreateModal(controller)
  const importPreviewKey = [
    Number(modal.importPreview.opened),
    modal.importPreview.previewData?.fileName ?? 'empty',
    modal.importPreview.previewData?.foundRecords ?? 0,
    modal.importPreview.previewData?.validCount ?? 0
  ].join(':')

  return (
    <>
      <Modal
        opened={modal.modal.opened}
        onClose={modal.modal.onClose}
        centered
        size={580}
        title={
          <Stack gap={4}>
            <Title order={2} className={classes.modalTitle}>
              Crear nuevo lote
            </Title>
            <Text className={classes.description}>
              Completá los datos y cargá los CUITs a analizar
            </Text>
          </Stack>
        }
        classNames={{
          content: classes.content,
          header: classes.modalHeader,
          body: classes.modalBody,
          close: classes.closeButton,
          overlay: classes.overlay
        }}
      >
        <Stack gap={20} className={classes.form}>
          <BatchManagementCreateFormFields fields={modal.fields} />
          <BatchManagementLoadedCuitsSection
            loadedCuits={modal.loadedCuits}
            fileInputRef={modal.fileInputRef}
            onFileInputChange={modal.onFileInputChange}
          />
        </Stack>

        <Group justify="flex-end" gap="sm" className={classes.footer}>
          <Button
            variant="default"
            className={classes.cancelButton}
            onClick={modal.footer.cancelButton.onClick}
          >
            Cancelar
          </Button>
          <Button
            className={
              modal.footer.submitButton.active
                ? classes.submitButtonActive
                : classes.submitButton
            }
            disabled={modal.footer.submitButton.disabled}
            onClick={modal.footer.submitButton.onClick}
            loading={modal.footer.submitButton.loading}
          >
            Cargar lote
          </Button>
        </Group>
      </Modal>

      <BatchImportPreviewModal key={importPreviewKey} {...modal.importPreview} />
    </>
  )
}
