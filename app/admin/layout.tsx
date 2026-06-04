import { Suspense, type ReactNode } from 'react';
import AdminLayoutFallback from './AdminLayoutFallback';
import AdminLayoutGate from './AdminLayoutGate';

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<AdminLayoutFallback />}>
      <AdminLayoutGate>{children}</AdminLayoutGate>
    </Suspense>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
}
