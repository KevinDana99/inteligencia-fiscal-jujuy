import {
  DELETE_MODAL_DESCRIPTION,
  DELETE_MODAL_TITLE,
  EDIT_MODAL_LABEL,
  EDIT_MODAL_PLACEHOLDER,
  EDIT_MODAL_TITLE,
  EDIT_MODAL_UPDATE_TITLE
} from '../constants/unifiedRegisterPreviewModals';
import type { ContactForm, DeleteKind, EditKind } from '../hooks/unified-register-preview/types';

export function getEditModalMeta(editKind: EditKind, editingItemId: string | null) {
  if (!editKind) {
    return { title: '', label: '', placeholder: '' };
  }

  return {
    title: editingItemId ? EDIT_MODAL_UPDATE_TITLE[editKind] : EDIT_MODAL_TITLE[editKind],
    label: EDIT_MODAL_LABEL[editKind],
    placeholder: EDIT_MODAL_PLACEHOLDER[editKind]
  };
}

export function getDeleteModalMeta(deleteKind: DeleteKind) {
  if (!deleteKind) {
    return { title: '', description: '' };
  }

  return {
    title: DELETE_MODAL_TITLE[deleteKind],
    description: DELETE_MODAL_DESCRIPTION[deleteKind]
  };
}

export function isContactFormEmpty(contactForm: ContactForm) {
  return (
    !contactForm.phone.trim() &&
    !contactForm.mail.trim() &&
    !contactForm.legal.trim() &&
    !contactForm.accountant.trim()
  );
}
