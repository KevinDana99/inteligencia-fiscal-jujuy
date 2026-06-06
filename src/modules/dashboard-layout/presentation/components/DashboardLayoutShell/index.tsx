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

export function DashboardLayoutShell({
  session,
  initialConfig,
  children
}: {
  session: IAuthSession
  initialConfig: ConfigurationType
  children: ReactNode
}) {
  const { currentSection, currentSectionLabel, navGroups } =
    useDashboardLayoutShell()

  return (
    <ConfigProvider initialConfig={initialConfig}>
      <DashboardNavbarActionProvider key={currentSection}>
        <DashboardTemplate
          session={session}
          currentSection={currentSection}
          currentSectionLabel={currentSectionLabel}
          analisisItems={navGroups.analisis}
          seguimientoItems={navGroups.seguimiento}
          personalizacionItems={navGroups.personalizacion}
        >
          {children}
        </DashboardTemplate>
      </DashboardNavbarActionProvider>
    </ConfigProvider>
  )
}
