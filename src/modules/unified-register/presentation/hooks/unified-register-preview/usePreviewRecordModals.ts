'use client';

import { useState } from 'react';
import type { IUnifiedRegisterContact } from '../../../data/models/UnifiedRegister';
import { EMPTY_CONTACT_FORM } from './constants';
import type { ContactForm, DeleteKind, EditableItem, EditKind } from './types';
import { getContactFormFromContacts } from './utils';

type UsePreviewRecordModalsParams = {
  contacts: IUnifiedRegisterContact[];
  clearRecordErrors: () => void;
};

export function usePreviewRecordModals({
  contacts,
  clearRecordErrors
}: UsePreviewRecordModalsParams) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editKind, setEditKind] = useState<EditKind>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const [contactForm, setContactForm] =
    useState<ContactForm>(EMPTY_CONTACT_FORM);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteKind, setDeleteKind] = useState<DeleteKind>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const openCreateModal = (kind: Exclude<EditKind, null>) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(null);
    setFormValue(null);
    clearRecordErrors();
    setContactForm(EMPTY_CONTACT_FORM);
  };

  const openEditModal = (
    kind: Exclude<EditKind, null>,
    itemToEdit: EditableItem
  ) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(
      kind === 'contact'
        ? (itemToEdit as IUnifiedRegisterContact).recordId ?? itemToEdit.id
        : itemToEdit.id
    );
    clearRecordErrors();

    if (kind === 'contact') {
      setContactForm(getContactFormFromContacts(contacts));
      return;
    }

    if ('text' in itemToEdit) {
      setFormValue(itemToEdit.text);
      return;
    }

    setFormValue('address' in itemToEdit ? itemToEdit.address : itemToEdit.value);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const resetEditModal = () => {
    setIsEditModalOpen(false);
    setEditKind(null);
    setEditingItemId(null);
    setFormValue(null);
    clearRecordErrors();
    setContactForm(EMPTY_CONTACT_FORM);
  };

  const openDeleteModal = (kind: Exclude<DeleteKind, null>, itemId: string) => {
    setIsDeleteModalOpen(true);
    setDeleteKind(kind);
    setDeletingItemId(itemId);
    clearRecordErrors();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const resetDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteKind(null);
    setDeletingItemId(null);
    clearRecordErrors();
  };

  const setContactField = (field: keyof ContactForm, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  return {
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    editingItemId,
    deletingItemId,
    formValue,
    contactForm,
    setFormValue,
    setContactField,
    openCreateModal,
    openEditModal,
    closeEditModal,
    resetEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetDeleteModal
  };
}
