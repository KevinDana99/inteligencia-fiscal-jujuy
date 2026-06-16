import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import type { PreviewController } from '../../types';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type LotConfirmModalProps = {
  preview: PreviewController;
};

export function LotConfirmModal({ preview }: LotConfirmModalProps) {
  return (
    <Modal
      opened={Boolean(preview.selectedLotOption)}
      onClose={preview.closeLotConfirmModal}
      title="Agregar a lote"
      centered
      size={420}
      zIndex={900}
      classNames={{
        overlay: classes.modalOverlay,
        inner: classes.modalInner,
        content: `${classes.modalContent} ${classes.lotConfirmModalContent}`,
        header: `${classes.modalHeader} ${classes.lotConfirmModalHeader}`,
        body: `${classes.modalBody} ${classes.lotConfirmModalBody}`,
        title: classes.modalTitle
      }}
    >
      {preview.selectedLotOption ? (
        <Stack gap={0}>
          <Text className={`${classes.modalText} ${classes.lotConfirmModalText}`}>
            ¿Querés agregar este CUIT al lote {preview.selectedLotOption.label} (
            {preview.selectedLotOption.cuitCount} CUITs actualmente)
          </Text>
          {preview.addToBatchError ? (
            <Text className={classes.modalErrorText}>{preview.addToBatchError}</Text>
          ) : null}
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              radius="xl"
              className={`${classes.modalGhostButton} ${classes.staticButton}`}
              onClick={preview.closeLotConfirmModal}
              disabled={preview.isAddToBatchPending}
            >
              Cancelar
            </Button>
            <Button
              radius="xl"
              className={`${classes.modalPrimaryButton} ${classes.staticButton}`}
              loading={preview.isAddToBatchPending}
              onClick={preview.confirmLotSelection}
            >
              Confirmar
            </Button>
          </Group>
        </Stack>
      ) : null}
    </Modal>
  );
}
