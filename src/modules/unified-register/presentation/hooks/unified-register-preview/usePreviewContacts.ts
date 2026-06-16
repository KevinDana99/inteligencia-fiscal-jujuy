'use client';

import { useCallback, useState, useTransition } from 'react';
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts';
import { mapContactRecordToViewModel } from '../../../data/mappers/mapContact';
import type {
  IUnifiedRegisterContact,
  IUnifiedRegisterContactsListData
} from '../../../data/models/UnifiedRegister';
import {
  deleteContactRecord,
  loadContactsPage,
  saveContactRecord
} from './contactOperations';
import type { ContactForm } from './types';

type UsePreviewContactsParams = { contributorId: string; initialContacts: IUnifiedRegisterContact[]; initialContactsData: IUnifiedRegisterContactsListData | null; shouldHydrateOnMount?: boolean; };

export function usePreviewContacts({
  contributorId,
  initialContacts,
  initialContactsData,
  shouldHydrateOnMount = false
}: UsePreviewContactsParams) {
  const [contacts, setContacts] = useState(initialContacts);
  const [isContactsHydrating, setIsContactsHydrating] =
    useState(shouldHydrateOnMount);
  const [contactActionError, setContactActionError] = useState<string | null>(
    null
  );
  const [contactsCurrentPage, setContactsCurrentPage] = useState(
    initialContactsData?.pagina ?? 1
  );
  const [contactsTotalPages, setContactsTotalPages] = useState(
    initialContactsData?.totalPaginas ?? 0
  );
  const [isContactsPagePending, startContactsPageTransition] = useTransition();
  const [isContactSavePending, startContactSaveTransition] = useTransition();
  const [isContactDeletePending, startContactDeleteTransition] = useTransition();

  const applyContactsListData = useCallback(
    (data: IUnifiedRegisterContactsListData) => {
      setContacts(data.contactos.flatMap(mapContactRecordToViewModel));
      setContactsCurrentPage(data.pagina);
      setContactsTotalPages(data.totalPaginas);
    },
    []
  );

  const refreshContacts = async (page: number) => {
    const result = await loadContactsPage(contributorId, page);

    if (!result.data) {
      setContactActionError(result.error ?? 'No fue posible listar los contactos.');
      return false;
    }

    applyContactsListData(result.data);
    setContactActionError(null);
    return true;
  };

  const hydrateContacts = (
    data: IUnifiedRegisterContactsListData | null,
    error?: string | null
  ) => {
    if (data) {
      applyContactsListData(data);
    } else {
      setContacts([]);
      setContactsCurrentPage(1);
      setContactsTotalPages(0);
    }

    setContactActionError(error ?? null);
    setIsContactsHydrating(false);
  };

  const saveContact = (
    editingItemId: string | null,
    contactForm: ContactForm,
    onSuccess: () => void
  ) => {
    setContactActionError(null);
    startContactSaveTransition(async () => {
      const result = await saveContactRecord(
        contributorId,
        editingItemId,
        contactForm
      );

      if (!result.success) {
        setContactActionError(result.error ?? 'No fue posible guardar el contacto.');
        return;
      }

      const refreshed = await refreshContacts(editingItemId ? contactsCurrentPage : 1);
      toast.show(
        editingItemId
          ? TOAST_DASHBOARD_MESSAGES.UPDATE_CONTACT_SUCCESS
          : TOAST_DASHBOARD_MESSAGES.ADD_CONTACT_SUCCESS
      );
      if (refreshed) {
        onSuccess();
      }
    });
  };

  const deleteContact = (contactId: string, onSuccess: () => void) => {
    setContactActionError(null);
    startContactDeleteTransition(async () => {
      const targetPage =
        contactsCurrentPage > 1 && contacts.length > 0
          ? contactsCurrentPage - 1
          : contactsCurrentPage;
      const result = await deleteContactRecord(contributorId, contactId);

      if (!result.success) {
        setContactActionError(result.error ?? 'No fue posible eliminar el contacto.');
        return;
      }

      const refreshed = await refreshContacts(targetPage);
      toast.show(TOAST_DASHBOARD_MESSAGES.DELETE_CONTACT_ERROR);
      if (refreshed) {
        onSuccess();
      }
    });
  };

  const goToPreviousContactPage = () => {
    if (contactsCurrentPage > 1) {
      startContactsPageTransition(() => { void refreshContacts(contactsCurrentPage - 1); });
    }
  };

  const goToNextContactPage = () => {
    if (contactsCurrentPage < contactsTotalPages) {
      startContactsPageTransition(() => { void refreshContacts(contactsCurrentPage + 1); });
    }
  };

  return {
    contacts, contactActionError, contactsCurrentPage, contactsTotalPages,
    isContactsHydrating, isContactsPagePending, isContactSavePending,
    isContactDeletePending, setContactActionError, hydrateContacts, saveContact,
    deleteContact, goToPreviousContactPage, goToNextContactPage
  };
}
