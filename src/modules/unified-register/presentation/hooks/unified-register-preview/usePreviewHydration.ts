'use client';

import { useMemo } from 'react';
import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNotesListData
} from '../../../data/models/UnifiedRegister';

type UsePreviewHydrationParams = {
  hydrateAvailableCrosses: (data: IBatchAvailableCrosses) => void;
  hydrateReprocessingState: (isMarked: boolean) => void;
  hydrateAddresses: (
    data: IUnifiedRegisterAddress[],
    error?: string | null
  ) => void;
  hydrateContacts: (
    data: IUnifiedRegisterContactsListData | null,
    error?: string | null
  ) => void;
  hydrateNotes: (
    data: IUnifiedRegisterNotesListData | null,
    error?: string | null
  ) => void;
  hydrateMercurio: (
    data: IUnifiedRegisterFinesListData | null,
    error?: string | null
  ) => void;
  hydrateInterventionOrders: (
    data: IUnifiedRegisterInterventionOrdersListData | null,
    error?: string | null
  ) => void;
};

export function usePreviewHydration(params: UsePreviewHydrationParams) {
  return useMemo(
    () => ({
      hydrateAvailableCrosses: params.hydrateAvailableCrosses,
      hydrateReprocessingState: params.hydrateReprocessingState,
      hydrateAddresses: params.hydrateAddresses,
      hydrateContacts: params.hydrateContacts,
      hydrateNotes: params.hydrateNotes,
      hydrateMercurio: params.hydrateMercurio,
      hydrateInterventionOrders: params.hydrateInterventionOrders
    }),
    [
      params.hydrateAddresses,
      params.hydrateAvailableCrosses,
      params.hydrateContacts,
      params.hydrateInterventionOrders,
      params.hydrateMercurio,
      params.hydrateNotes,
      params.hydrateReprocessingState
    ]
  );
}
