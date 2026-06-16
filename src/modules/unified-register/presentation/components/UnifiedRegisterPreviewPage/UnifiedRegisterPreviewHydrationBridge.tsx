'use client';

import { useEffect } from 'react';
import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNotesListData
} from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterPreviewHydration } from '../../contexts/UnifiedRegisterPreviewHydrationContext';

type UnifiedRegisterPreviewHydrationBridgeProps = {
  moduleKey: string;
  availableCrosses?: IBatchAvailableCrosses;
  isReprocessingMarked?: boolean;
  addresses?: IUnifiedRegisterAddress[];
  addressesError?: string | null;
  contactsData?: IUnifiedRegisterContactsListData | null;
  contactsError?: string | null;
  notesData?: IUnifiedRegisterNotesListData | null;
  notesError?: string | null;
  mercurioData?: IUnifiedRegisterFinesListData | null;
  mercurioError?: string | null;
  interventionOrdersData?: IUnifiedRegisterInterventionOrdersListData | null;
  interventionOrdersError?: string | null;
};

export function UnifiedRegisterPreviewHydrationBridge({
  moduleKey,
  availableCrosses,
  isReprocessingMarked,
  addresses,
  addressesError,
  contactsData,
  contactsError,
  notesData,
  notesError,
  mercurioData,
  mercurioError,
  interventionOrdersData,
  interventionOrdersError
}: UnifiedRegisterPreviewHydrationBridgeProps) {
  const hydration = useUnifiedRegisterPreviewHydration();

  useEffect(() => {
    if (availableCrosses) {
      hydration.hydrateAvailableCrosses(availableCrosses);
    }

    if (typeof isReprocessingMarked === 'boolean') {
      hydration.hydrateReprocessingState(isReprocessingMarked);
    }

    if (addresses || addressesError !== undefined) {
      hydration.hydrateAddresses(addresses ?? [], addressesError);
    }

    if (contactsData !== undefined || contactsError !== undefined) {
      hydration.hydrateContacts(contactsData ?? null, contactsError);
    }

    if (notesData !== undefined || notesError !== undefined) {
      hydration.hydrateNotes(notesData ?? null, notesError);
    }

    if (mercurioData !== undefined || mercurioError !== undefined) {
      hydration.hydrateMercurio(mercurioData ?? null, mercurioError);
    }

    if (
      interventionOrdersData !== undefined ||
      interventionOrdersError !== undefined
    ) {
      hydration.hydrateInterventionOrders(
        interventionOrdersData ?? null,
        interventionOrdersError
      );
    }
  }, [
    addresses,
    addressesError,
    availableCrosses,
    contactsData,
    contactsError,
    hydration,
    interventionOrdersData,
    interventionOrdersError,
    isReprocessingMarked,
    mercurioData,
    mercurioError,
    moduleKey,
    notesData,
    notesError
  ]);

  return null;
}

