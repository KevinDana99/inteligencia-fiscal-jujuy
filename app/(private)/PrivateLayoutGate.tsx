import type { ReactNode } from 'react';
import { connection } from 'next/server';
import DashboardLayoutModule from '@/modules/dashboard-layout';
import { requireServerAuthSession } from '@/lib/auth/require-session';

export default async function PrivateLayoutGate({
  children
}: {
  children: ReactNode;
}) {
  await connection();
  const session = await requireServerAuthSession();

  return <DashboardLayoutModule session={session}>{children}</DashboardLayoutModule>;
}
