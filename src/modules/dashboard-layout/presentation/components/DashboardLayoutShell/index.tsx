'use client'

import type { ReactNode } from 'react'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import type { ConfigurationType } from '@/modules/configuration-module/types'
import { ConfigProvider } from '@/modules/configuration-module/presentation/contexts'
import {
  DashboardNavbarActionProvider
} from '../../contexts'
import { DashboardTemplate } from '../DashboardTemplate'
import { useDashboardLayoutShell } from '../../hooks'
import { DASHBOARD_NAV_GROUPS } from '../../../constants'

interface DashboardLayoutShellProps {
  session: IAuthSession;
  initialConfig: ConfigurationType;
  children: ReactNode;
}

export function DashboardLayoutShell({
  session,
  initialConfig,
  children
}: DashboardLayoutShellProps) {
  const { currentSection, currentSectionLabel, navGroups } =
    useDashboardLayoutShell()

  return (
    <ConfigProvider initialConfig={initialConfig}>
      <DashboardNavbarActionProvider key={currentSection}>
        <DashboardTemplate
          session={session}
          currentSection={currentSection}
          currentSectionLabel={currentSectionLabel}
          analisisItems={navGroups[DASHBOARD_NAV_GROUPS.ANALYSIS]}
          seguimientoItems={navGroups[DASHBOARD_NAV_GROUPS.TRACKING]}
          personalizacionItems={navGroups[DASHBOARD_NAV_GROUPS.CUSTOMIZATION]}
        >
          {children}
        </DashboardTemplate>
      </DashboardNavbarActionProvider>
    </ConfigProvider>
  )
}
