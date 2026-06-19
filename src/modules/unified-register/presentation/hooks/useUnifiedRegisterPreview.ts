'use client';

import { useState } from 'react';
import { usePreviewAddresses } from './unified-register-preview/usePreviewAddresses';
import { usePreviewBatchOptions } from './unified-register-preview/usePreviewBatchOptions';
import { usePreviewContacts } from './unified-register-preview/usePreviewContacts';
import { usePreviewCrosses } from './unified-register-preview/usePreviewCrosses';
import { usePreviewHydration } from './unified-register-preview/usePreviewHydration';
import { usePreviewNotes } from './unified-register-preview/usePreviewNotes';
import { usePreviewRecordActions } from './unified-register-preview/usePreviewRecordActions';
import { usePreviewRecordModals } from './unified-register-preview/usePreviewRecordModals';
import { usePreviewRemoteTables } from './unified-register-preview/usePreviewRemoteTables';
import { usePreviewReprocessing } from './unified-register-preview/usePreviewReprocessing';
import { usePreviewSourceTables } from './unified-register-preview/usePreviewSourceTables';
import type {
  HeaderModal,
  UseUnifiedRegisterPreviewParams
} from './unified-register-preview/types';

export function useUnifiedRegisterPreview({
  item,
  initialAvailableCrosses,
  initialIsReprocessing,
  initialContactsData,
  initialNotesData,
  initialMercurioData,
  initialInterventionOrdersData,
  hydration = {}
}: UseUnifiedRegisterPreviewParams) {
  const [activeHeaderModal, setActiveHeaderModal] = useState<HeaderModal>(null);
  const sourceTables = usePreviewSourceTables(item);
  const addresses = usePreviewAddresses({
    contributorId: item.contribuyenteId,
    initialAddresses: item.addresses,
    shouldHydrateOnMount: Boolean(hydration.addresses)
  });
  const contacts = usePreviewContacts({
    contributorId: item.contribuyenteId,
    initialContacts: item.contacts,
    initialContactsData,
    shouldHydrateOnMount: Boolean(hydration.contacts)
  });
  const notes = usePreviewNotes({
    contributorId: item.contribuyenteId,
    initialNotes: item.notes,
    initialNotesData,
    shouldHydrateOnMount: Boolean(hydration.notes)
  });
  const batch = usePreviewBatchOptions({
    item,
    activeHeaderModal,
    setActiveHeaderModal
  });
  const crosses = usePreviewCrosses({
    contributorId: item.contribuyenteId,
    initialAvailableCrosses,
    shouldHydrateOnMount: Boolean(hydration.availableCrosses),
    onConfirmed: () => setActiveHeaderModal(null)
  });
  const reprocessing = usePreviewReprocessing({
    contributorId: item.contribuyenteId,
    cuit: item.cuit,
    initialIsReprocessing,
    shouldHydrateOnMount: Boolean(hydration.reprocessing),
    openReprocessingModal: () => setActiveHeaderModal('reprocessing')
  });
  const remoteTables = usePreviewRemoteTables({
    item,
    initialMercurioData,
    initialInterventionOrdersData,
    waitForMercurio: Boolean(hydration.mercurio),
    waitForInterventionOrders: Boolean(hydration.interventionOrders)
  });

  const clearRecordErrors = () => {
    addresses.clearAddressError();
    contacts.setContactActionError(null);
    notes.setNoteActionError(null);
  };
  const recordModals = usePreviewRecordModals({
    contacts: contacts.contacts,
    clearRecordErrors
  });
  const recordActions = usePreviewRecordActions({
    ...recordModals,
    saveAddress: addresses.saveAddress,
    saveContact: contacts.saveContact,
    saveNote: notes.saveNote,
    deleteAddress: addresses.deleteAddress,
    deleteContact: contacts.deleteContact,
    deleteNote: notes.deleteNote
  });

  const openHeaderModal = (modal: HeaderModal) => {
    if (modal === 'reprocessing') reprocessing.clearReprocessingError();
    if (modal === 'batch') batch.resetBatchOptions();
    if (modal === 'crosses') crosses.clearCrossExecutionError();
    setActiveHeaderModal(modal);
  };
  const closeHeaderModal = () => {
    setActiveHeaderModal(null);
    batch.resetBatchSearch();
    reprocessing.clearReprocessingError();
    batch.clearBatchErrors();
    crosses.clearCrossExecutionError();
  };
  const previewHydration = usePreviewHydration({
    hydrateAvailableCrosses: crosses.hydrateAvailableCrosses,
    hydrateReprocessingState: reprocessing.hydrateReprocessingState,
    hydrateAddresses: addresses.hydrateAddresses,
    hydrateContacts: contacts.hydrateContacts,
    hydrateNotes: notes.hydrateNotes,
    hydrateMercurio: remoteTables.hydrateMercurio,
    hydrateInterventionOrders: remoteTables.hydrateInterventionOrders
  });

  return {
    activeHeaderModal,
    ...addresses,
    ...contacts,
    ...notes,
    ...sourceTables,
    ...batch,
    ...crosses,
    ...reprocessing,
    ...recordModals,
    ...recordActions,
    ...remoteTables,
    openHeaderModal,
    closeHeaderModal,
    hydration: previewHydration
  };
}
