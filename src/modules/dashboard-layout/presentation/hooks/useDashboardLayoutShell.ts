'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  DASHBOARD_NAV_ITEMS,
  type DashboardNavGroup,
  getDashboardSectionFromPathname,
  getDashboardSectionLabel
} from '../../data/models/DashboardLayout';
import {
  DASHBOARD_DEFAULT_PATHNAME,
  DASHBOARD_NAV_GROUPS
} from '../../constants';

const getNavItemsByGroup = (group: DashboardNavGroup) =>
  DASHBOARD_NAV_ITEMS.filter((item) => item.group === group);

export function useDashboardLayoutShell() {
  const pathname = usePathname();

  const currentSection = useMemo(
    () => getDashboardSectionFromPathname(pathname ?? DASHBOARD_DEFAULT_PATHNAME),
    [pathname]
  );

  const currentSectionLabel = useMemo(
    () => getDashboardSectionLabel(currentSection),
    [currentSection]
  );

  const navGroups = useMemo(
    () => ({
      [DASHBOARD_NAV_GROUPS.ANALYSIS]: getNavItemsByGroup(
        DASHBOARD_NAV_GROUPS.ANALYSIS
      ),
      [DASHBOARD_NAV_GROUPS.TRACKING]: getNavItemsByGroup(
        DASHBOARD_NAV_GROUPS.TRACKING
      ),
      [DASHBOARD_NAV_GROUPS.CUSTOMIZATION]: getNavItemsByGroup(
        DASHBOARD_NAV_GROUPS.CUSTOMIZATION
      )
    }),
    []
  );

  return {
    currentSection,
    currentSectionLabel,
    navGroups
  };
}
