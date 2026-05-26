'use client'

import type { ReactNode } from 'react'
import { useDisclosure } from '@mantine/hooks'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { useSignOut } from '@/modules/auth/presentation/hooks'
import type { AdminPanelSection } from '../../../data/models/AdminPanel'
import { AdminPanelActionModal } from '../AdminPanelModals/AdminPanelActionModal'
import { AdminPanelNavbar } from '../AdminPanelNavbar'
import { AdminPanelSidebar } from '../AdminPanelSidebar'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'

export function AdminPanelTemplate({
  session,
  currentSection,
  children
}: {
  session: IAuthSession
  currentSection: AdminPanelSection
  children: ReactNode
}) {
  const { signOut, isPending: isSignOutPending } = useSignOut()
  const [logoutOpened, logoutHandlers] = useDisclosure(false)

  return (
    <div className={classes.page}>
      <div className={classes.layout}>
        <AdminPanelNavbar
          session={session}
          onSignOutClick={logoutHandlers.open}
          isSignOutPending={isSignOutPending}
        />

        <AdminPanelSidebar currentSection={currentSection} />

        <main className={classes.main}>
          <div className={classes.content}>{children}</div>
        </main>

        <AdminPanelActionModal
          opened={logoutOpened}
          title='Cerrar sesión'
          description='Vas a cerrar tu sesión de administrador. Podrás volver a ingresar desde el acceso admin.'
          icon='logout'
          semantic='blue'
          confirmLabel='Salir'
          loading={isSignOutPending}
          onClose={logoutHandlers.close}
          onConfirm={signOut}
        />
      </div>
    </div>
  )
}
