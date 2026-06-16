'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { IBatchAvailableCrosses } from '@/modules/batch-management/data/models/BatchManagement';
import type {
  IUnifiedRegisterAddress,
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterNotesListData
} from '../../data/models/UnifiedRegister';

type UnifiedRegisterPreviewHydrationContextValue = {
  hydrateAvailableCrosses: (data: IBatchAvailableCrosses) => void;
  hydrateReprocessingState: (isReprocessingMarked: boolean) => void;
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

const UnifiedRegisterPreviewHydrationContext =
  createContext<UnifiedRegisterPreviewHydrationContextValue | null>(null);

export function UnifiedRegisterPreviewHydrationProvider({
  children,
  value
}: {
  children: ReactNode;
  value: UnifiedRegisterPreviewHydrationContextValue;
}) {
  return (
    <UnifiedRegisterPreviewHydrationContext.Provider value={value}>
      {children}
    </UnifiedRegisterPreviewHydrationContext.Provider>
  );
}

export function useUnifiedRegisterPreviewHydration() {
  const context = useContext(UnifiedRegisterPreviewHydrationContext);

  if (!context) {
    throw new Error(
      'useUnifiedRegisterPreviewHydration must be used inside UnifiedRegisterPreviewHydrationProvider'
    );
  }

  return context;
}

