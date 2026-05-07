'use client';

import type { ReactNode } from 'react';
import { AdminConfigProvider } from '../../contexts';

export function AdminPanelProviders({ children }: { children: ReactNode }) {
  return <AdminConfigProvider>{children}</AdminConfigProvider>;
}
