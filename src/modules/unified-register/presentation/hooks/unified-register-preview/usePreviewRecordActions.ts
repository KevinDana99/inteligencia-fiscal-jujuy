'use client';

import type { ContactForm, DeleteKind, EditKind } from './types';

type UsePreviewRecordActionsParams = {
  editKind: EditKind;
  deleteKind: DeleteKind;
  editingItemId: string | null;
  deletingItemId: string | null;
  formValue: string | null;
  contactForm: ContactForm;
  closeEditModal: () => void;
  resetEditModal: () => void;
  closeDeleteModal: () => void;
  resetDeleteModal: () => void;
  saveAddress: (id: string | null, value: string, onSuccess: () => void) => void;
  saveContact: (id: string | null, form: ContactForm, onSuccess: () => void) => void;
  saveNote: (id: string | null, value: string, onSuccess: () => void) => void;
  deleteAddress: (id: string, onSuccess: () => void) => void;
  deleteContact: (id: string, onSuccess: () => void) => void;
  deleteNote: (id: string, onSuccess: () => void) => void;
};

export function usePreviewRecordActions({
  editKind,
  deleteKind,
  editingItemId,
  deletingItemId,
  formValue,
  contactForm,
  closeEditModal,
  resetEditModal,
  closeDeleteModal,
  resetDeleteModal,
  saveAddress,
  saveContact,
  saveNote,
  deleteAddress,
  deleteContact,
  deleteNote
}: UsePreviewRecordActionsParams) {
  const submitEditModal = () => {
    if (!editKind) {
      return;
    }

    if (editKind === 'address') {
      saveAddress(editingItemId, formValue ?? '', resetEditModal);
      return;
    }

    if (editKind === 'contact') {
      saveContact(editingItemId, contactForm, resetEditModal);
      return;
    }

    if (editKind === 'note') {
      saveNote(editingItemId, formValue ?? '', resetEditModal);
      return;
    }

    closeEditModal();
  };

  const confirmDeleteModal = () => {
    if (!deleteKind || !deletingItemId) {
      return;
    }

    if (deleteKind === 'address') {
      deleteAddress(deletingItemId, resetDeleteModal);
      return;
    }

    if (deleteKind === 'contact') {
      deleteContact(deletingItemId, resetDeleteModal);
      return;
    }

    if (deleteKind === 'note') {
      deleteNote(deletingItemId, resetDeleteModal);
      return;
    }

    closeDeleteModal();
  };

  return {
    submitEditModal,
    confirmDeleteModal
  };
}
