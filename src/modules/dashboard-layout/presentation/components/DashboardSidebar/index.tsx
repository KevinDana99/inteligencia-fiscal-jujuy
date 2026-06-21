'use client'
import { useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ActionIcon, Avatar, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDoorExit, IconX } from '@tabler/icons-react'
import { formatPersonName, getInitials, getRoleLabel } from '@/utils'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { useSignOut } from '@/modules/auth/presentation/hooks'
import { ADMIN_PANEL_LOGOUT_MODAL } from '@/modules/admin-panel/presentation/constants/adminPanelLayout'
import type {
  DashboardSection,
  IDashboardNavItem
} from '../../../data/models/DashboardLayout'
import {
  DASHBOARD_NAV_GROUP_LABELS,
  DASHBOARD_NAV_GROUPS
} from '../../../constants'
import { DashboardLogoutModal } from '../DashboardLogoutModal'
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css'
import CustomIcon from '@/global/icons'

interface DashboardSidebarProps {
  session: IAuthSession
  currentSection: DashboardSection
  analisisItems: IDashboardNavItem[]
  seguimientoItems: IDashboardNavItem[]
  personalizacionItems: IDashboardNavItem[]
  isMobileOpen: boolean
  onNavigate: () => void
}

interface SidebarNavProps {
  currentSection: DashboardSection
  groups: SidebarNavGroup[]
  onNavigate: () => void
}

interface SidebarBrandProps {
  onClose: () => void
}

interface SidebarNavGroup {
  label: string
  items: IDashboardNavItem[]
}

interface SidebarNavGroupProps {
  currentSection: DashboardSection
  group: SidebarNavGroup
  onNavigate: () => void
}

interface SidebarNavItemProps {
  currentSection: DashboardSection
  item: IDashboardNavItem
  onNavigate: () => void
}

interface SidebarFooterProps {
  isPending: boolean
  onSignOut: () => void
  session: IAuthSession
}

export function DashboardSidebar({
  session,
  currentSection,
  analisisItems,
  seguimientoItems,
  personalizacionItems,
  isMobileOpen,
  onNavigate
}: DashboardSidebarProps) {
  const { signOut, isPending } = useSignOut()
  const [logoutOpened, logoutHandlers] = useDisclosure(false)
  const handleSignOut = useCallback(() => {
    logoutHandlers.close()
    signOut()
  }, [logoutHandlers, signOut])
  const groups: SidebarNavGroup[] = [
    {
      label: DASHBOARD_NAV_GROUP_LABELS[DASHBOARD_NAV_GROUPS.ANALYSIS],
      items: analisisItems
    },
    {
      label: DASHBOARD_NAV_GROUP_LABELS[DASHBOARD_NAV_GROUPS.TRACKING],
      items: seguimientoItems
    },
    {
      label: DASHBOARD_NAV_GROUP_LABELS[DASHBOARD_NAV_GROUPS.CUSTOMIZATION],
      items: personalizacionItems
    }
  ]

  return (
    <aside
      className={`${classes.sidebar} ${
        isMobileOpen ? classes.sidebarMobileOpen : ''
      }`}
    >
      <div className={classes.sidebarTop}>
        <SidebarBrand onClose={onNavigate} />
        <SidebarNav
          currentSection={currentSection}
          groups={groups}
          onNavigate={onNavigate}
        />
      </div>

      <SidebarFooter
        isPending={isPending}
        onSignOut={logoutHandlers.open}
        session={session}
      />

      <DashboardLogoutModal
        opened={logoutOpened}
        title={ADMIN_PANEL_LOGOUT_MODAL.title}
        description={ADMIN_PANEL_LOGOUT_MODAL.description}
        confirmLabel={ADMIN_PANEL_LOGOUT_MODAL.confirmLabel}
        loading={isPending}
        onClose={logoutHandlers.close}
        onConfirm={handleSignOut}
      />
    </aside>
  )
}

function SidebarBrand({ onClose }: SidebarBrandProps) {
  return (
    <div className={classes.brandContainer}>
      <div className={classes.brand}>
        <Image
          src='/assets/branding/logo-mini.svg'
          alt='Dirección Provincial de Rentas'
          width={36}
          height={36}
          className={classes.brandLogo}
        />

        <div className={classes.brandText}>
          <span className={classes.brandTitle}>Inteligencia Fiscal</span>
          <span className={classes.brandSubtitle}>DGR Jujuy</span>
        </div>
      </div>

      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Cerrar navegación"
        className={classes.sidebarCloseButton}
        onClick={onClose}
      >
        <IconX size={18} stroke={1.9} />
      </ActionIcon>
    </div>
  )
}

function SidebarNav({ currentSection, groups, onNavigate }: SidebarNavProps) {
  return (
    <nav
      className={classes.navRoot}
      aria-label='Navegación principal del dashboard'
    >
      {groups.map((group) => (
        <SidebarNavGroup
          key={group.label}
          currentSection={currentSection}
          group={group}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}

function SidebarNavGroup({
  currentSection,
  group,
  onNavigate
}: SidebarNavGroupProps) {
  return (
    <div className={classes.navGroup}>
      <span className={classes.navGroupLabel}>{group.label}</span>
      {group.items.map((item) => (
        <SidebarNavItem
          key={item.section}
          currentSection={currentSection}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function SidebarNavItem({
  currentSection,
  item,
  onNavigate
}: SidebarNavItemProps) {
  const isActive = currentSection === item.section

  return (
    <Link
      href={item.href}
      prefetch={false}
      className={`${classes.navItem} ${isActive ? classes.navItemActive : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      <CustomIcon name={item.icon} size={15} />
      {item.label}
    </Link>
  )
}

function SidebarFooter({ isPending, onSignOut, session }: SidebarFooterProps) {
  return (
    <div className={classes.sidebarFooter}>
      <div className={classes.userRow}>
        <Avatar size={28} radius='xl' className={classes.sidebarAvatar}>
          {getInitials(session.user.nombreUsuario ?? '')}
        </Avatar>

        <div className={classes.userMeta}>
          <span className={classes.userName}>
            {formatPersonName(session.user.nombreUsuario) || 'Usuario'}
          </span>
          <span className={classes.userRole}>
            {getRoleLabel(session.user.tipoUsuario)}
          </span>
        </div>

        <Tooltip label='Salir' position='right' withArrow>
          <ActionIcon
            variant='default'
            color='gray'
            size='lg'
            radius='md'
            onClick={onSignOut}
            disabled={isPending}
            aria-label='Salir'
            className={classes.sidebarLogoutButton}
          >
            <IconDoorExit size={16} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  )
}
