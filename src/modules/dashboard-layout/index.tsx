import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type { ConfigurationType } from '@/modules/configuration-module/types'
import { DashboardLayoutShell } from './presentation/components/DashboardLayoutShell';

export default function DashboardLayoutModule({
  session,
  initialConfig,
  children
}: {
  session: IAuthSession;
  initialConfig: ConfigurationType
  children: ReactNode;
}) {
  return (
    <DashboardLayoutShell session={session} initialConfig={initialConfig}>
      {children}
    </DashboardLayoutShell>
  )
}
