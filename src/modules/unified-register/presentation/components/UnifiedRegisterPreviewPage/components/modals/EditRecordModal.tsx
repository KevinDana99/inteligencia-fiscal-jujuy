import { Modal } from '@mantine/core';
import { getEditModalMeta } from '../../../../utils/unifiedRegisterPreviewModals';
import type { PreviewController } from '../../types';
import { ContactEditForm } from './ContactEditForm';
import { NoteEditForm } from './NoteEditForm';
import { SimpleEditForm } from './SimpleEditForm';
import classes from '../../UnifiedRegisterPreviewPage.module.css';

type EditRecordModalProps = {
  preview: PreviewController;
};

export function EditRecordModal({ preview }: EditRecordModalProps) {
  const meta = getEditModalMeta(preview.editKind, preview.editingItemId);
  const isEditingContact = preview.editKind === 'contact';
  const isEditingNote = preview.editKind === 'note';

  return (
    <Modal
      opened={preview.isEditModalOpen}
      onClose={preview.closeEditModal}
      onExitTransitionEnd={preview.resetEditModal}
      title={meta.title}
      centered
      withCloseButton={!isEditingNote}
      zIndex={900}
      classNames={{
        overlay: classes.modalOverlay,
        inner: classes.modalInner,
        content: `${classes.modalContent} ${
          isEditingContact ? classes.contactModalContent : ''
        } ${isEditingNote ? classes.noteModalContent : ''}`,
        header: `${classes.modalHeader} ${
          isEditingContact ? classes.contactModalHeader : ''
        } ${isEditingNote ? classes.noteModalHeader : ''}`,
        body: `${classes.modalBody} ${
          isEditingContact ? classes.contactModalBody : ''
        } ${isEditingNote ? classes.noteModalBody : ''}`,
        title: classes.modalTitle
      }}
    >
      {isEditingContact ? (
        <ContactEditForm preview={preview} />
      ) : isEditingNote ? (
        <NoteEditForm preview={preview} />
      ) : (
        <SimpleEditForm preview={preview} />
      )}
    </Modal>
  );
}
