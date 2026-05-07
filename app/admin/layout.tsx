import type { ReactNode } from 'react';
import { AdminPanelProviders } from '@/modules/admin-panel/presentation/components/AdminPanelProviders';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminPanelProviders>{children}</AdminPanelProviders>;
}
