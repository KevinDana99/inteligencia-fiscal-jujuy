'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ICatalogShowcase } from '../../data/models/CatalogShowcase';

const CatalogShowcaseContext = createContext<ICatalogShowcase | null>(null);

export function CatalogShowcaseProvider({
  children,
  value
}: {
  children: ReactNode;
  value: ICatalogShowcase;
}) {
  return (
    <CatalogShowcaseContext.Provider value={value}>
      {children}
    </CatalogShowcaseContext.Provider>
  );
}

export function useCatalogShowcaseContext() {
  const context = useContext(CatalogShowcaseContext);

  if (!context) {
    throw new Error('useCatalogShowcaseContext must be used within CatalogShowcaseProvider');
  }

  return context;
}
