import { ADMIN_PANEL_ROUTES } from '@/constants'
import type { AdminPanelSection } from '../../data/models/AdminPanel'

export function getAdminPanelSectionFromPathname(
  pathname: string
): AdminPanelSection {
  if (pathname.startsWith(ADMIN_PANEL_ROUTES.settings)) {
    return 'settings'
  }

  return 'dashboard'
}
