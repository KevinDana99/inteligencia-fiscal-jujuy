import type { Route } from 'next';

export type DashboardSection =
  | 'padron-unificado'
  | 'gestion-de-lotes'
  | 'gestion-de-cruces'
  | 'reproceso';

export type DashboardNavGroup = 'analisis' | 'seguimiento';

export interface IDashboardNavItem {
  section: DashboardSection;
  label: string;
  href: Route;
  group: DashboardNavGroup;
  icon: 'search' | 'grid' | 'activity' | 'clock';
}

export const DASHBOARD_NAV_ITEMS: IDashboardNavItem[] = [
  {
    section: 'padron-unificado',
    label: 'Padrón Unificado',
    href: '/',
    group: 'analisis',
    icon: 'search'
  },
  {
    section: 'gestion-de-lotes',
    label: 'Gestión de Lotes',
    href: '/gestion-de-lotes',
    group: 'analisis',
    icon: 'grid'
  },
  {
    section: 'gestion-de-cruces',
    label: 'Gestión de Cruces',
    href: '/gestion-de-cruces',
    group: 'analisis',
    icon: 'activity'
  },
  {
    section: 'reproceso',
    label: 'Reproceso',
    href: '/reproceso',
    group: 'seguimiento',
    icon: 'clock'
  }
];

export function getDashboardSectionFromPathname(pathname: string): DashboardSection {
  switch (pathname) {
    case '/gestion-de-lotes':
      return 'gestion-de-lotes';
    case '/gestion-de-cruces':
      return 'gestion-de-cruces';
    case '/reproceso':
      return 'reproceso';
    case '/':
    default:
      return 'padron-unificado';
  }
}

export function getDashboardSectionLabel(section: DashboardSection): string {
  return (
    DASHBOARD_NAV_ITEMS.find((item) => item.section === section)?.label ?? 'Padrón Unificado'
  );
}
