import type { ReactNode } from 'react';
import { connection } from 'next/server';
import { requireAdminSession } from '@/lib/auth/require-admin-session';
import { getAllowedDomainsAction } from '@/modules/admin-panel/data/actions';
import { AdminPanelLayoutShell } from '@/modules/admin-panel/presentation/components/AdminPanelLayoutShell';

export default async function AdminLayoutGate({
  children
}: AdminLayoutGateProps) {
  await connection();

  const session = await requireAdminSession();
  const allowedDomainsResult = await getAllowedDomainsAction();

  if (allowedDomainsResult.error || !allowedDomainsResult.data) {
    throw new Error(
      allowedDomainsResult.error ?? 'No allowed domains received'
    );
  }

  return (
    <AdminPanelLayoutShell
      session={session}
      initialAllowedDomains={allowedDomainsResult.data}
    >
      {children}
    </AdminPanelLayoutShell>
  );
}

interface AdminLayoutGateProps {
  children: ReactNode;
}
