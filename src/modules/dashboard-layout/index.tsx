import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type { ConfigurationType } from '@/modules/configuration-module/types'
import { DashboardLayoutShell } from './presentation/components/DashboardLayoutShell';

interface DashboardLayoutModuleProps {
  session: IAuthSession;
  initialConfig: ConfigurationType;
  children: ReactNode;
}

export default function DashboardLayoutModule({
  session,
  initialConfig,
  children
}: DashboardLayoutModuleProps) {
  return (
    <DashboardLayoutShell session={session} initialConfig={initialConfig}>
      {children}
    </DashboardLayoutShell>
  )
}
