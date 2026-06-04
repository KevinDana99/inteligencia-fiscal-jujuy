'use client'

import type { ReactNode } from 'react'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import type { IAdminAllowedDomains } from '../../../data/models/AdminPanel'
import { useAdminPanelLayoutShell } from '../../hooks'
import { AdminPanelActionModal } from '../AdminPanelModals/AdminPanelActionModal'
import { AdminPanelNavbar } from '../AdminPanelNavbar'
import { AdminPanelProviders } from '../AdminPanelProviders'
import { AdminPanelSidebar } from '../AdminPanelSidebar'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelLayoutShell({
  session,
  initialAllowedDomains,
  children
}: AdminPanelLayoutShellProps) {
  const { providersKey, currentSection, navbar, logoutModal } =
    useAdminPanelLayoutShell({
      session,
      initialAllowedDomains
    })

  return (
    <AdminPanelProviders
      key={providersKey}
      initialAllowedDomains={initialAllowedDomains}
    >
      <div className={classes.page}>
        <div className={classes.layout}>
          <AdminPanelNavbar {...navbar} />

          <AdminPanelSidebar currentSection={currentSection} />

          <main className={classes.main}>
            <div className={classes.content}>{children}</div>
          </main>

          <AdminPanelActionModal {...logoutModal} />
        </div>
      </div>
    </AdminPanelProviders>
  )
}

interface AdminPanelLayoutShellProps {
  session: IAuthSession
  initialAllowedDomains: IAdminAllowedDomains
  children: ReactNode
}
