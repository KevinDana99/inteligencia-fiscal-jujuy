'use client'

import { useMemo } from 'react'
import type { AdminPanelSection } from '../../data/models/AdminPanel'
import {
  ADMIN_PANEL_NAV_GROUPS,
  type AdminPanelNavGroup,
  type AdminPanelNavItem
} from '../constants/adminPanelNavigation'
import classes from '../styles/AdminPanel.module.css'

export function useAdminPanelSidebar(currentSection: AdminPanelSection) {
  const navGroups = useMemo<AdminPanelSidebarNavGroup[]>(
    () =>
      ADMIN_PANEL_NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          className:
            currentSection === item.section
              ? `${classes.navItem} ${classes.navItemActive}`
              : classes.navItem
        }))
      })),
    [currentSection]
  )

  return {
    navGroups
  }
}

type AdminPanelSidebarNavGroup = Omit<AdminPanelNavGroup, 'items'> & {
  items: AdminPanelSidebarNavItem[]
}

type AdminPanelSidebarNavItem = AdminPanelNavItem & {
  className: string
}
