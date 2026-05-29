'use client';

import { useMemo, useState } from 'react';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterContact,
  IUnifiedRegisterDetail,
  IUnifiedRegisterNote,
  IUnifiedRegisterSourceTable
} from '../../data/models/UnifiedRegister';

type HeaderModal = null | 'reprocessing' | 'crosses' | 'report' | 'batch';
type EditKind = null | 'address' | 'contact' | 'note';
type DeleteKind = null | 'address' | 'contact' | 'note';

type EditableItem = IUnifiedRegisterAddress | IUnifiedRegisterContact | IUnifiedRegisterNote;
type ContactForm = {
  phone: string;
  mail: string;
  legal: string;
  accountant: string;
};

const EMPTY_CONTACT_FORM: ContactForm = {
  phone: '',
  mail: '',
  legal: '',
  accountant: ''
};

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
  const [contactForm, setContactForm] = useState<ContactForm>(EMPTY_CONTACT_FORM);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteKind, setDeleteKind] = useState<DeleteKind>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [selectedLotOption, setSelectedLotOption] = useState<IUnifiedRegisterBatchOption | null>(null);
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

  const selectLotOption = (lot: IUnifiedRegisterBatchOption) => {
    setSelectedLotOption(lot);
    setActiveHeaderModal(null);
    setBatchSearch('');
  };

  const closeLotConfirmModal = () => {
    setSelectedLotOption(null);
  };

  const openCreateModal = (kind: Exclude<EditKind, null>) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(null);
    setFormValue(null);
    setContactForm(kind === 'contact' ? EMPTY_CONTACT_FORM : EMPTY_CONTACT_FORM);
  };

  const openEditModal = (kind: Exclude<EditKind, null>, itemToEdit: EditableItem) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(itemToEdit.id);
    if (kind === 'contact') {
      setContactForm({
        phone: contacts.find((entry) => entry.id === 'phone')?.value ?? '',
        mail: contacts.find((entry) => entry.id === 'mail')?.value ?? '',
        legal: contacts.find((entry) => entry.id === 'legal')?.value ?? '',
        accountant: contacts.find((entry) => entry.id === 'accountant')?.value ?? ''
      });
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
    setContactForm(EMPTY_CONTACT_FORM);
  };

  const submitEditModal = () => {
    if (!editKind) {
      return;
    }

    if (editKind !== 'contact' && !formValue?.trim()) {
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
      const nextContacts: IUnifiedRegisterContact[] = [];
      if (contactForm.phone.trim()) {
        nextContacts.push({ id: 'phone', label: 'Teléfono', value: contactForm.phone.trim() });
      }
      if (contactForm.mail.trim()) {
        nextContacts.push({ id: 'mail', label: 'Mail', value: contactForm.mail.trim() });
      }
      if (contactForm.legal.trim()) {
        nextContacts.push({
          id: 'legal',
          label: 'Representante legal',
          value: contactForm.legal.trim()
        });
      }
      if (contactForm.accountant.trim()) {
        nextContacts.push({
          id: 'accountant',
          label: 'Contador',
          value: contactForm.accountant.trim()
        });
      }
      setContacts(nextContacts);
      closeEditModal();
      return;
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

  const setContactField = (field: keyof ContactForm, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
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
      setContacts([]);
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
    selectedLotOption,
    activeNote,
    activeNoteIndex,
    isEditModalOpen,
    isDeleteModalOpen,
    editKind,
    deleteKind,
    formValue,
    contactForm,
    editingItemId,
    setBatchSearch,
    setActiveSourceTableId,
    setFormValue,
    setContactField,
    openHeaderModal,
    closeHeaderModal,
    selectLotOption,
    closeLotConfirmModal,
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
