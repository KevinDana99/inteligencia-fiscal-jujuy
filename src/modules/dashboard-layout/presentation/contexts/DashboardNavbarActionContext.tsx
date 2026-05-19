'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';

interface IDashboardNavbarActionContext {
  explorerSelectedCount: number;
  setExplorerSelectedCount: (count: number) => void;
  resetExplorerSelectedCount: () => void;
}

const DashboardNavbarActionContext = createContext<IDashboardNavbarActionContext | null>(null);

export function DashboardNavbarActionProvider({
  children
}: {
  children: ReactNode;
}) {
  const [explorerSelectedCount, setExplorerSelectedCount] = useState(0);

  const resetExplorerSelectedCount = useCallback(() => {
    setExplorerSelectedCount(0);
  }, []);

  const value = useMemo(
    () => ({
      explorerSelectedCount,
      setExplorerSelectedCount,
      resetExplorerSelectedCount
    }),
    [explorerSelectedCount, resetExplorerSelectedCount]
  );

  return (
    <DashboardNavbarActionContext.Provider value={value}>
      {children}
    </DashboardNavbarActionContext.Provider>
  );
}

export function useDashboardNavbarActionContext() {
  const context = useContext(DashboardNavbarActionContext);

  if (!context) {
    throw new Error(
      'useDashboardNavbarActionContext must be used within DashboardNavbarActionProvider'
    );
  }

  return context;
}
