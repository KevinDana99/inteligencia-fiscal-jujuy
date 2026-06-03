'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  createAlternateAddressAction,
  createContactAction,
  createNoteAction,
  deleteAlternateAddressAction,
  deleteContactAction,
  deleteNoteAction,
  getContactsAction,
  getNotesAction,
  getUnifiedRegisterInterventionOrdersAction,
  getUnifiedRegisterMercurioAction,
  updateContactAction,
  updateNoteAction,
  updateAlternateAddressAction
} from '../../data/actions';
import { mapAlternateAddressRecordToViewModel } from '../../data/mappers/mapAlternateAddress';
import { mapContactRecordToViewModel } from '../../data/mappers/mapContact';
import { mapNoteRecordToViewModel } from '../../data/mappers/mapNote';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterBatchOption,
  IUnifiedRegisterContact,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNote,
  IUnifiedRegisterNotesListData,
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

export function useUnifiedRegisterPreview(
  item: IUnifiedRegisterDetail,
  initialContactsData: IUnifiedRegisterContactsListData | null,
  initialNotesData: IUnifiedRegisterNotesListData | null,
  initialMercurioData: IUnifiedRegisterFinesListData | null,
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null
) {
  const [activeHeaderModal, setActiveHeaderModal] = useState<HeaderModal>(null);
  const [batchSearch, setBatchSearch] = useState('');
  const [addresses, setAddresses] = useState(item.addresses);
  const [addressActionError, setAddressActionError] = useState<string | null>(null);
  const [contacts, setContacts] = useState(item.contacts);
  const [contactActionError, setContactActionError] = useState<string | null>(null);
  const [contactsCurrentPage, setContactsCurrentPage] = useState(initialContactsData?.pagina ?? 1);
  const [contactsTotalPages, setContactsTotalPages] = useState(
    initialContactsData?.totalPaginas ?? 0
  );
  const [notes, setNotes] = useState(item.notes);
  const [noteActionError, setNoteActionError] = useState<string | null>(null);
  const [notesCurrentPage, setNotesCurrentPage] = useState(initialNotesData?.pagina ?? 1);
  const [notesTotalPages, setNotesTotalPages] = useState(initialNotesData?.totalPaginas ?? 0);
  const [fines, setFines] = useState(item.fines);
  const [finesCurrentPage, setFinesCurrentPage] = useState(
    initialMercurioData?.pagina ?? 1
  );
  const [finesTotalPages, setFinesTotalPages] = useState(
    initialMercurioData?.totalPaginas ?? 0
  );
  const [finesTotalItems, setFinesTotalItems] = useState(
    initialMercurioData?.totalItems ?? item.fines.length
  );
  const [fineActionError, setFineActionError] = useState<string | null>(null);
  const [interventionOrders, setInterventionOrders] = useState(item.interventionOrders);
  const [interventionOrdersCurrentPage, setInterventionOrdersCurrentPage] = useState(
    initialInterventionOrdersData?.pagina ?? 1
  );
  const [interventionOrdersTotalPages, setInterventionOrdersTotalPages] = useState(
    initialInterventionOrdersData?.totalPaginas ?? 0
  );
  const [interventionOrdersTotalItems, setInterventionOrdersTotalItems] = useState(
    initialInterventionOrdersData?.totalItems ?? item.interventionOrders.length
  );
  const [interventionOrdersError, setInterventionOrdersError] = useState<string | null>(null);
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
  const [isAddressSavePending, startAddressSaveTransition] = useTransition();
  const [isAddressDeletePending, startAddressDeleteTransition] = useTransition();
  const [isContactsPagePending, startContactsPageTransition] = useTransition();
  const [isContactSavePending, startContactSaveTransition] = useTransition();
  const [isContactDeletePending, startContactDeleteTransition] = useTransition();
  const [isNotesPagePending, startNotesPageTransition] = useTransition();
  const [isFinesPagePending, startFinesPageTransition] = useTransition();
  const [isInterventionOrdersPagePending, startInterventionOrdersPageTransition] =
    useTransition();
  const [isNoteSavePending, startNoteSaveTransition] = useTransition();
  const [isNoteDeletePending, startNoteDeleteTransition] = useTransition();

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

  const applyContactsListData = (data: IUnifiedRegisterContactsListData) => {
    setContacts(data.contactos.flatMap(mapContactRecordToViewModel));
    setContactsCurrentPage(data.pagina);
    setContactsTotalPages(data.totalPaginas);
  };

  const refreshContacts = async (page: number) => {
    const result = await getContactsAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 1
    });

    if (!result.data) {
      setContactActionError(result.error ?? 'No fue posible listar los contactos.');
      return false;
    }

    applyContactsListData(result.data);
    setContactActionError(null);
    return true;
  };

  const applyNotesListData = (data: IUnifiedRegisterNotesListData) => {
    setNotes(data.notas.map(mapNoteRecordToViewModel));
    setNotesCurrentPage(data.pagina);
    setNotesTotalPages(data.totalPaginas);
    setActiveNoteIndex(0);
  };

  const refreshNotes = async (page: number) => {
    const result = await getNotesAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 1
    });

    if (!result.data) {
      setNoteActionError(result.error ?? 'No fue posible listar las notas.');
      return false;
    }

    applyNotesListData(result.data);
    setNoteActionError(null);
    return true;
  };

  const applyFinesListData = (data: IUnifiedRegisterFinesListData) => {
    setFines(
      data.multas.map((fine) => ({
        id: fine.numero,
        issuedAt: fine.fecha,
        description: fine.descripcion ?? '-',
        amount: fine.monto,
        status: fine.estado
      }))
    );
    setFinesCurrentPage(data.pagina);
    setFinesTotalPages(data.totalPaginas);
    setFinesTotalItems(data.totalItems);
  };

  const refreshFines = async (page: number) => {
    const result = await getUnifiedRegisterMercurioAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 3
    });

    if (!result.data) {
      setFineActionError(result.error ?? 'No fue posible listar las multas Mercurio.');
      return false;
    }

    applyFinesListData(result.data);
    setFineActionError(null);
    return true;
  };

  const applyInterventionOrdersListData = (
    data: IUnifiedRegisterInterventionOrdersListData
  ) => {
    setInterventionOrders(
      data.ordenes.map((order) => ({
        id: order.numero,
        period: order.periodo,
        reason: order.motivo,
        amount: order.monto,
        status: order.estado
      }))
    );
    setInterventionOrdersCurrentPage(data.pagina);
    setInterventionOrdersTotalPages(data.totalPaginas);
    setInterventionOrdersTotalItems(data.totalItems);
  };

  const refreshInterventionOrders = async (page: number) => {
    const result = await getUnifiedRegisterInterventionOrdersAction(item.contribuyenteId, {
      pagina: page,
      itemsPagina: 3
    });

    if (!result.data) {
      setInterventionOrdersError(
        result.error ?? 'No fue posible listar las órdenes de intervención.'
      );
      return false;
    }

    applyInterventionOrdersListData(result.data);
    setInterventionOrdersError(null);
    return true;
  };

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
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
    setContactForm(kind === 'contact' ? EMPTY_CONTACT_FORM : EMPTY_CONTACT_FORM);
  };

  const openEditModal = (kind: Exclude<EditKind, null>, itemToEdit: EditableItem) => {
    setIsEditModalOpen(true);
    setEditKind(kind);
    setEditingItemId(itemToEdit.id);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
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
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
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
      const normalizedDireccion = formValue?.trim() ?? '';
      setAddressActionError(null);

      startAddressSaveTransition(async () => {
        const result = editingItemId
          ? await updateAlternateAddressAction(item.contribuyenteId, editingItemId, {
              direccion: normalizedDireccion
            })
          : await createAlternateAddressAction(item.contribuyenteId, {
              direccion: normalizedDireccion
            });

        if (!result.success || !result.data) {
          setAddressActionError(
            result.error ?? 'No fue posible guardar el domicilio alternativo.'
          );
          return;
        }

        const nextAddress = mapAlternateAddressRecordToViewModel(result.data);

        setAddresses((current) =>
          editingItemId
            ? current.map((entry) =>
                entry.id === editingItemId ? nextAddress : entry
              )
            : [...current, nextAddress]
        );

        resetEditModal();
      });

      return;
    }

    if (editKind === 'contact') {
      setContactActionError(null);

      startContactSaveTransition(async () => {
        const payload = {
          telefono: contactForm.phone,
          correo: contactForm.mail,
          nombreRepresentanteLegal: contactForm.legal,
          nombreContador: contactForm.accountant
        };

        const result = editingItemId
          ? await updateContactAction(item.contribuyenteId, editingItemId, payload)
          : await createContactAction(item.contribuyenteId, payload);

        if (!result.success) {
          setContactActionError(result.error ?? 'No fue posible guardar el contacto.');
          return;
        }

        const refreshed = await refreshContacts(editingItemId ? contactsCurrentPage : 1);

        if (refreshed) {
          resetEditModal();
        }
      });

      return;
    }

    if (editKind === 'note') {
      const nextNoteText = formValue?.trim() ?? '';
      setNoteActionError(null);

      startNoteSaveTransition(async () => {
        const result = editingItemId
          ? await updateNoteAction(item.contribuyenteId, editingItemId, {
              descripcion: nextNoteText
            })
          : await createNoteAction(item.contribuyenteId, {
              descripcion: nextNoteText
            });

        if (!result.success) {
          setNoteActionError(result.error ?? 'No fue posible guardar la nota.');
          return;
        }

        const refreshed = await refreshNotes(editingItemId ? notesCurrentPage : 1);

        if (refreshed) {
          resetEditModal();
        }
      });

      return;
    }

    closeEditModal();
  };

  const openDeleteModal = (kind: Exclude<DeleteKind, null>, itemId: string) => {
    setIsDeleteModalOpen(true);
    setDeleteKind(kind);
    setDeletingItemId(itemId);
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
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
    setAddressActionError(null);
    setContactActionError(null);
    setNoteActionError(null);
  };

  const removeNote = (noteId: string) => {
    setNotes((current) => {
      const next = current.filter((entry) => entry.id !== noteId);
      setActiveNoteIndex((index) => Math.max(0, Math.min(index, next.length - 1)));
      return next;
    });
  };

  const goToPreviousNote = () => {
    if (notesCurrentPage <= 1) {
      return;
    }

    startNotesPageTransition(async () => {
      await refreshNotes(notesCurrentPage - 1);
    });
  };

  const goToNextNote = () => {
    if (notesCurrentPage >= notesTotalPages) {
      return;
    }

    startNotesPageTransition(async () => {
      await refreshNotes(notesCurrentPage + 1);
    });
  };

  const goToPreviousFinePage = () => {
    if (finesCurrentPage <= 1) {
      return;
    }

    startFinesPageTransition(async () => {
      await refreshFines(finesCurrentPage - 1);
    });
  };

  const goToNextFinePage = () => {
    if (finesCurrentPage >= finesTotalPages) {
      return;
    }

    startFinesPageTransition(async () => {
      await refreshFines(finesCurrentPage + 1);
    });
  };

  const goToPreviousInterventionOrderPage = () => {
    if (interventionOrdersCurrentPage <= 1) {
      return;
    }

    startInterventionOrdersPageTransition(async () => {
      await refreshInterventionOrders(interventionOrdersCurrentPage - 1);
    });
  };

  const goToNextInterventionOrderPage = () => {
    if (interventionOrdersCurrentPage >= interventionOrdersTotalPages) {
      return;
    }

    startInterventionOrdersPageTransition(async () => {
      await refreshInterventionOrders(interventionOrdersCurrentPage + 1);
    });
  };

  const confirmDeleteModal = () => {
    if (!deleteKind || !deletingItemId) {
      return;
    }

    if (deleteKind === 'address') {
      setAddressActionError(null);

      startAddressDeleteTransition(async () => {
        const result = await deleteAlternateAddressAction(
          item.contribuyenteId,
          deletingItemId
        );

        if (!result.success) {
          setAddressActionError(
            result.error ?? 'No fue posible eliminar el domicilio alternativo.'
          );
          return;
        }

        setAddresses((current) =>
          current.filter((entry) => entry.id !== deletingItemId)
        );
        resetDeleteModal();
      });

      return;
    }

    if (deleteKind === 'contact') {
      setContactActionError(null);

      startContactDeleteTransition(async () => {
        const targetPage =
          contactsCurrentPage > 1 && contacts.length > 0
            ? contactsCurrentPage - 1
            : contactsCurrentPage;

        const result = await deleteContactAction(item.contribuyenteId, deletingItemId);

        if (!result.success) {
          setContactActionError(result.error ?? 'No fue posible eliminar el contacto.');
          return;
        }

        const refreshed = await refreshContacts(targetPage);

        if (refreshed) {
          resetDeleteModal();
        }
      });

      return;
    }

    if (deleteKind === 'note') {
      setNoteActionError(null);

      startNoteDeleteTransition(async () => {
        const targetPage =
          notesCurrentPage > 1 && notes.length === 1
            ? notesCurrentPage - 1
            : notesCurrentPage;

        const result = await deleteNoteAction(item.contribuyenteId, deletingItemId);

        if (!result.success) {
          setNoteActionError(result.error ?? 'No fue posible borrar la nota.');
          return;
        }

        const refreshed = await refreshNotes(targetPage);

        if (refreshed) {
          resetDeleteModal();
        }
      });

      return;
    }

    closeDeleteModal();
  };

  return {
    activeHeaderModal,
    addresses,
    addressActionError,
    contacts,
    contactActionError,
    contactsCurrentPage,
    contactsTotalPages,
    notes,
    noteActionError,
    notesCurrentPage,
    notesTotalPages,
    fines,
    finesCurrentPage,
    finesTotalPages,
    finesTotalItems,
    fineActionError,
    interventionOrders,
    interventionOrdersCurrentPage,
    interventionOrdersTotalPages,
    interventionOrdersTotalItems,
    interventionOrdersError,
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
    isAddressSavePending,
    isAddressDeletePending,
    isContactsPagePending,
    isContactSavePending,
    isContactDeletePending,
    isNotesPagePending,
    isFinesPagePending,
    isInterventionOrdersPagePending,
    isNoteSavePending,
    isNoteDeletePending,
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
    removeNote,
    goToPreviousNote,
    goToNextNote,
    goToPreviousFinePage,
    goToNextFinePage,
    goToPreviousInterventionOrderPage,
    goToNextInterventionOrderPage
  };
}
