'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  DASHBOARD_NAV_ITEMS,
  getDashboardSectionFromPathname,
  getDashboardSectionLabel
} from '../../data/models/DashboardLayout';

export function useDashboardLayoutShell() {
  const pathname = usePathname();

  const currentSection = useMemo(
    () => getDashboardSectionFromPathname(pathname ?? '/'),
    [pathname]
  );

  const currentSectionLabel = useMemo(
    () => getDashboardSectionLabel(currentSection),
    [currentSection]
  );

  const navGroups = useMemo(
    () => ({
      analisis: DASHBOARD_NAV_ITEMS.filter((item) => item.group === 'analisis'),
      seguimiento: DASHBOARD_NAV_ITEMS.filter((item) => item.group === 'seguimiento')
    }),
    []
  );

  return {
    currentSection,
    currentSectionLabel,
    navGroups
  };
}
