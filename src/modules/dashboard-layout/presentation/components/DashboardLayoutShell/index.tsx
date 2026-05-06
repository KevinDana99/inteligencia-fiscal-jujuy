'use client';

import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { DashboardTemplate } from '../DashboardTemplate';
import { useDashboardLayoutShell } from '../../hooks';

export function DashboardLayoutShell({
  session,
  children
}: {
  session: IAuthSession;
  children: ReactNode;
}) {
  const { currentSection, currentSectionLabel, navGroups } = useDashboardLayoutShell();

  return (
    <DashboardTemplate
      session={session}
      currentSection={currentSection}
      currentSectionLabel={currentSectionLabel}
      analisisItems={navGroups.analisis}
      seguimientoItems={navGroups.seguimiento}
    >
      {children}
    </DashboardTemplate>
  );
}
