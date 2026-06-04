import type { ReactNode } from 'react';
import { connection } from 'next/server';
import DashboardLayoutModule from '@/modules/dashboard-layout';
import { requirePrivateDashboardSession } from '@/lib/auth/require-private-dashboard-session';

export default async function PrivateLayoutGate({
  children
}: {
  children: ReactNode;
}) {
  await connection();
  const session = await requirePrivateDashboardSession();

  return <DashboardLayoutModule session={session}>{children}</DashboardLayoutModule>;
}
