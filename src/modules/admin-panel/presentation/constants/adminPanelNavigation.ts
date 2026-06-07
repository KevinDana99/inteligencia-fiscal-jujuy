import type { ComponentType } from 'react'
import { IconHome, IconSettings } from '@tabler/icons-react'
import { ADMIN_PANEL_ROUTES } from '@/constants'
import type { AdminPanelSection } from '../../data/models/AdminPanel'

export const ADMIN_PANEL_NAV_GROUPS: AdminPanelNavGroup[] = [
  {
    id: 'primary',
    items: [
      {
        section: 'dashboard',
        href: ADMIN_PANEL_ROUTES.dashboard,
        label: 'Inicio',
        Icon: IconHome
      }
    ]
  },
  {
    id: 'customization',
    label: 'Personalización',
    items: [
      {
        section: 'settings',
        href: ADMIN_PANEL_ROUTES.settings,
        label: 'Configuración',
        Icon: IconSettings
      }
    ]
  }
]

export interface AdminPanelNavGroup {
  id: string
  label?: string
  items: AdminPanelNavItem[]
}

export interface AdminPanelNavItem {
  section: AdminPanelSection
  href: AdminPanelNavHref
  label: string
  Icon: ComponentType<{ size?: number }>
}

export type AdminPanelNavHref =
  (typeof ADMIN_PANEL_ROUTES)[keyof typeof ADMIN_PANEL_ROUTES]
