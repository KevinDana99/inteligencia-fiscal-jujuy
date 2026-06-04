import type { AdminPanelSection } from '../../data/models/AdminPanel'

export function getAdminPanelSectionFromPathname(
  pathname: string
): AdminPanelSection {
  if (pathname.startsWith('/admin/configuracion')) {
    return 'settings'
  }

  return 'dashboard'
}
