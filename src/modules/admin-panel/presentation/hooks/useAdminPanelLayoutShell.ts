'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useDisclosure } from '@mantine/hooks'
import { getInitials } from '@/utils'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { useSignOut } from '@/modules/auth/presentation/hooks'
import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'
import {
  ADMIN_PANEL_LOGOUT_MODAL,
  ADMIN_PANEL_PROFILE_LABEL
} from '../constants/adminPanelLayout'
import { buildAllowedDomainsKey } from '../utils/buildAllowedDomainsKey'
import { getAdminPanelSectionFromPathname } from '../utils/getAdminPanelSectionFromPathname'

export function useAdminPanelLayoutShell({
  session,
  initialAllowedDomains
}: UseAdminPanelLayoutShellOptions) {
  const pathname = usePathname()
  const { signOut, isPending: isSignOutPending } = useSignOut()
  const [logoutOpened, logoutHandlers] = useDisclosure(false)

  const handleSignOut = useCallback(() => {
    logoutHandlers.close()
    signOut()
  }, [logoutHandlers, signOut])

  return {
    providersKey: buildAllowedDomainsKey(initialAllowedDomains),
    currentSection: getAdminPanelSectionFromPathname(pathname),
    navbar: {
      profileInitials: getInitials(session.user.nombreUsuario ?? ''),
      profileLabel: ADMIN_PANEL_PROFILE_LABEL,
      isSignOutPending,
      onSignOutClick: logoutHandlers.open
    },
    logoutModal: {
      opened: logoutOpened,
      title: ADMIN_PANEL_LOGOUT_MODAL.title,
      description: ADMIN_PANEL_LOGOUT_MODAL.description,
      icon: 'logout' as const,
      semantic: 'blue' as const,
      confirmLabel: ADMIN_PANEL_LOGOUT_MODAL.confirmLabel,
      loading: isSignOutPending,
      onClose: logoutHandlers.close,
      onConfirm: handleSignOut
    }
  }
}

interface UseAdminPanelLayoutShellOptions {
  session: IAuthSession
  initialAllowedDomains: IAdminAllowedDomains
}
