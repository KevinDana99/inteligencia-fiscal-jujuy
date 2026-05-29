'use client'

import type { ReactNode } from 'react'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { DashboardNavbarActionProvider } from '../../contexts/DashboardNavbarActionContext'
import { DashboardTemplate } from '../DashboardTemplate'
import { useDashboardLayoutShell } from '../../hooks'

export function DashboardLayoutShell({
  session,
  children
}: {
  session: IAuthSession
  children: ReactNode
}) {
  const { currentSection, currentSectionLabel, navGroups } =
    useDashboardLayoutShell()

  return (
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
  )
}
