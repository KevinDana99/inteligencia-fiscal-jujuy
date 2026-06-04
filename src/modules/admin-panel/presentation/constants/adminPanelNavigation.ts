import type { ComponentType } from 'react'
import { IconHome, IconSettings } from '@tabler/icons-react'
import type { AdminPanelSection } from '../../data/models/AdminPanel'

export const ADMIN_PANEL_NAV_GROUPS: AdminPanelNavGroup[] = [
  {
    id: 'primary',
    items: [
      {
        section: 'dashboard',
        href: '/admin',
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
        href: '/admin/configuracion',
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

export type AdminPanelNavHref = '/admin' | '/admin/configuracion'
