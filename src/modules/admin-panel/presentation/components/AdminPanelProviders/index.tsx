'use client';

import type { ReactNode } from 'react';
import type { IAdminAllowedDomains } from '../../../data/models/AdminPanel';
import { AdminPanelConfigProvider } from '../../contexts';

export function AdminPanelProviders({
  children,
  initialAllowedDomains
}: {
  children: ReactNode
  initialAllowedDomains: IAdminAllowedDomains
}) {
  return (
    <AdminPanelConfigProvider initialAllowedDomains={initialAllowedDomains}>
      {children}
    </AdminPanelConfigProvider>
  );
}
