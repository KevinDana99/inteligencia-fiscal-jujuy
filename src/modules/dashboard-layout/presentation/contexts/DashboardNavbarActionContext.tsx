'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';

interface IDashboardNavbarActionContext {
  explorerSelectedCount: number;
  setExplorerSelectedCount: (count: number) => void;
  resetExplorerSelectedCount: () => void;
  navbarActionTarget: HTMLDivElement | null;
  registerNavbarActionTarget: (target: HTMLDivElement | null) => void;
}

interface DashboardNavbarActionProviderProps {
  children: ReactNode;
}

interface DashboardNavbarActionPortalProps {
  children: ReactNode;
}

const DashboardNavbarActionContext = createContext<IDashboardNavbarActionContext | null>(null);

export function DashboardNavbarActionProvider({
  children
}: DashboardNavbarActionProviderProps) {
  const [explorerSelectedCount, setExplorerSelectedCount] = useState(0);
  const [navbarActionTarget, setNavbarActionTarget] =
    useState<HTMLDivElement | null>(null);

  const resetExplorerSelectedCount = useCallback(() => {
    setExplorerSelectedCount(0);
  }, []);

  const registerNavbarActionTarget = useCallback(
    (target: HTMLDivElement | null) => {
      setNavbarActionTarget(target);
    },
    []
  );

  const value = useMemo(
    () => ({
      explorerSelectedCount,
      setExplorerSelectedCount,
      resetExplorerSelectedCount,
      navbarActionTarget,
      registerNavbarActionTarget
    }),
    [
      explorerSelectedCount,
      navbarActionTarget,
      registerNavbarActionTarget,
      resetExplorerSelectedCount
    ]
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

export function DashboardNavbarActionPortal({
  children
}: DashboardNavbarActionPortalProps) {
  const { navbarActionTarget } = useDashboardNavbarActionContext();

  if (!navbarActionTarget) {
    return null;
  }

  return createPortal(children, navbarActionTarget);
}
