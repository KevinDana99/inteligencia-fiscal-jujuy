'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useDisclosure } from '@mantine/hooks'
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
  const [
    isSidebarOpen,
    { close: closeSidebar, open: openSidebar }
  ] = useDisclosure(false)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [closeSidebar])

  return (
    <AdminPanelProviders
      key={providersKey}
      initialAllowedDomains={initialAllowedDomains}
    >
      <div className={classes.page}>
        <div className={classes.layout}>
          <AdminPanelNavbar {...navbar} onSidebarOpen={openSidebar} />

          <AdminPanelSidebar
            currentSection={currentSection}
            isMobileOpen={isSidebarOpen}
            onNavigate={closeSidebar}
          />

          <button
            type='button'
            aria-label='Cerrar navegación'
            className={`${classes.sidebarOverlay} ${
              isSidebarOpen ? classes.sidebarOverlayVisible : ''
            }`}
            onClick={closeSidebar}
          />

          <main
            className={`${classes.main} ${
              isSidebarOpen ? classes.mainMobileSidebarOpen : ''
            }`}
          >
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
