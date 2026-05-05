import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { DashboardLayoutShell } from './presentation/components/DashboardLayoutShell';

export default function DashboardLayoutModule({
  session,
  children
}: {
  session: IAuthSession;
  children: ReactNode;
}) {
  return <DashboardLayoutShell session={session}>{children}</DashboardLayoutShell>;
}
