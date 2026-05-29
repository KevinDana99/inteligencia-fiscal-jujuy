'use client';

import { useMemo, useState } from 'react';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContact,
  IUnifiedRegisterDetail,
  IUnifiedRegisterNote,
  IUnifiedRegisterSourceTable
} from '../../data/models/UnifiedRegister';

type HeaderModal = null | 'reprocessing' | 'crosses' | 'report' | 'batch';
type EditKind = null | 'address' | 'contact' | 'note';
type DeleteKind = null | 'address' | 'contact' | 'note';

type EditableItem = IUnifiedRegisterAddress | IUnifiedRegisterContact | IUnifiedRegisterNote;

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useUnifiedRegisterPreview(item: IUnifiedRegisterDetail) {
  const [activeHeaderModal, setActiveHeaderModal] = useState<HeaderModal>(null);
  const [batchSearch, setBatchSearch] = useState('');
  const [addresses, setAddresses] = useState(item.addresses);
  const [contacts, setContacts] = useState(item.contacts);
  const [notes, setNotes] = useState(item.notes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editKind, setEditKind] = useState<EditKind>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteKind, setDeleteKind] = useState<DeleteKind>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [activeSourceTableId, setActiveSourceTableId] =
    useState<IUnifiedRegisterSourceTable['id']>('inm');
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);

  const filteredLotOptions = useMemo(() => {
    const normalizedSearch = batchSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return item.lotOptions;
    }

    return item.lotOptions.filter((lot) => {
      return (
        lot.label.toLowerCase().includes(normalizedSearch) ||
        lot.regime.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [batchSearch, item.lotOptions]);

  const activeSourceTable =
    item.sourceTables.find((table) => table.id === activeSourceTableId) ?? item.sourceTables[0];

  const activeNote = notes[activeNoteIndex] ?? null;

  const openHeaderModal = (modal: HeaderModal) => setActiveHeaderModal(modal);
  const closeHeaderModal = () => {
    setActiveHeaderModal(null);
    setBatchSearch('');
  };

  const openCreateModal = (kind: Exclude<EditKind, null>) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(null);
    setFormValue(null);
  };

  const openEditModal = (kind: Exclude<EditKind, null>, itemToEdit: EditableItem) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(itemToEdit.id);
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
  };

  const submitEditModal = () => {
    if (!editKind || !formValue?.trim()) {
      return;
    }

    if (editKind === 'address') {
      if (editingItemId) {
        setAddresses((current) =>
          current.map((entry) =>
            entry.id === editingItemId
              ? { ...entry, address: formValue }
              : entry
          )
        );
      } else {
        setAddresses((current) => [
          ...current,
          { id: createId('address'), label: 'Alternativo', address: formValue }
        ]);
      }
    }

    if (editKind === 'contact') {
      if (editingItemId) {
        setContacts((current) =>
          current.map((entry) =>
            entry.id === editingItemId
              ? { ...entry, value: formValue }
              : entry
          )
        );
      } else {
        setContacts((current) => [
          ...current,
          { id: createId('contact'), label: 'Contacto', value: formValue }
        ]);
      }
    }

    if (editKind === 'note') {
      if (editingItemId) {
        setNotes((current) =>
          current.map((entry) =>
            entry.id === editingItemId
              ? { ...entry, text: formValue }
              : entry
          )
        );
      } else {
        setNotes((current) => [
          ...current,
          {
            id: createId('note'),
            text: formValue,
            createdAt: new Date().toLocaleDateString('es-AR')
          }
        ]);
      }
    }

    closeEditModal();
  };

  const openDeleteModal = (kind: Exclude<DeleteKind, null>, itemId: string) => {
    setIsDeleteModalOpen(true);
    setDeleteKind(kind);
    setDeletingItemId(itemId);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const resetDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteKind(null);
    setDeletingItemId(null);
  };

  const removeAddress = (addressId: string) => {
    setAddresses((current) => current.filter((entry) => entry.id !== addressId));
  };

  const removeContact = (contactId: string) => {
    setContacts((current) => current.filter((entry) => entry.id !== contactId));
  };

  const removeNote = (noteId: string) => {
    setNotes((current) => {
      const next = current.filter((entry) => entry.id !== noteId);
      setActiveNoteIndex((index) => Math.max(0, Math.min(index, next.length - 1)));
      return next;
    });
  };

  const goToPreviousNote = () => {
    setActiveNoteIndex((current) => Math.max(current - 1, 0));
  };

  const goToNextNote = () => {
    setActiveNoteIndex((current) => Math.min(current + 1, Math.max(notes.length - 1, 0)));
  };

  const confirmDeleteModal = () => {
    if (!deleteKind || !deletingItemId) {
      return;
    }

    if (deleteKind === 'address') {
      removeAddress(deletingItemId);
    }

    if (deleteKind === 'contact') {
      removeContact(deletingItemId);
    }

    if (deleteKind === 'note') {
      removeNote(deletingItemId);
    }

    closeDeleteModal();
  };

  return {
    activeHeaderModal,
    addresses,
    contacts,
    notes,
    batchSearch,
    filteredLotOptions,
    activeSourceTableId,
    activeSourceTable,
    activeNote,
    activeNoteIndex,
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    formValue,
    editingItemId,
    setBatchSearch,
    setActiveSourceTableId,
    setFormValue,
    openHeaderModal,
    closeHeaderModal,
    openCreateModal,
    openEditModal,
    closeEditModal,
    resetEditModal,
    submitEditModal,
    openDeleteModal,
    closeDeleteModal,
    resetDeleteModal,
    confirmDeleteModal,
    removeAddress,
    removeContact,
    removeNote,
    goToPreviousNote,
    goToNextNote
  };
}
