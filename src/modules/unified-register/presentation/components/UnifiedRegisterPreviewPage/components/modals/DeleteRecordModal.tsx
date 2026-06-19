import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { getDeleteModalMeta } from '../../../../utils/unifiedRegisterPreviewModals';
import type { PreviewController } from '../../types';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type DeleteRecordModalProps = {
  preview: PreviewController;
};

export function DeleteRecordModal({ preview }: DeleteRecordModalProps) {
  const meta = getDeleteModalMeta(preview.deleteKind);

  return (
    <Modal
      opened={preview.isDeleteModalOpen}
      onClose={preview.closeDeleteModal}
      onExitTransitionEnd={preview.resetDeleteModal}
      title={meta.title}
      centered
      zIndex={900}
      classNames={{
        overlay: classes.modalOverlay,
        inner: classes.modalInner,
        content: classes.modalContent,
        header: classes.modalHeader,
        body: classes.modalBody,
        title: classes.modalTitle
      }}
    >
      {preview.deleteKind ? (
        <Stack gap="lg">
          <Text className={classes.modalText}>{meta.description}</Text>
          <DeleteError preview={preview} />
          <Group justify="flex-end">
            <Button
              variant="default"
              radius="xl"
              className={`${classes.modalGhostButton} ${classes.staticButton}`}
              onClick={preview.closeDeleteModal}
              disabled={isDeletePending(preview)}
            >
              Cancelar
            </Button>
            <Button
              radius="xl"
              className={`${classes.deletePrimaryButton} ${classes.staticButton}`}
              onClick={preview.confirmDeleteModal}
              loading={isDeletePending(preview)}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      ) : null}
    </Modal>
  );
}

function DeleteError({ preview }: DeleteRecordModalProps) {
  const error =
    preview.deleteKind === 'address'
      ? preview.addressActionError
      : preview.deleteKind === 'contact'
        ? preview.contactActionError
        : preview.deleteKind === 'note'
          ? preview.noteActionError
          : null;

  return error ? <Text className={classes.modalText} c="red">{error}</Text> : null;
}

function isDeletePending(preview: PreviewController) {
  return (
    (preview.deleteKind === 'address' && preview.isAddressDeletePending) ||
    (preview.deleteKind === 'contact' && preview.isContactDeletePending) ||
    (preview.deleteKind === 'note' && preview.isNoteDeletePending)
  );
}
