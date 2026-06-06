'use client'
import Link from 'next/link'
import { ActionIcon, Avatar, Tooltip } from '@mantine/core'
import { IconDoorExit } from '@tabler/icons-react'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { useSignOut } from '@/modules/auth/presentation/hooks'
import type {
  DashboardSection,
  IDashboardNavItem
} from '../../../data/models/DashboardLayout'
import { getInitials } from '../../utils/getInitials'
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css'
import Image from 'next/image'
import getRoleLabel from '../../utils/getRoleLabel'
import CustomIcon from '@/global/icons'

export function DashboardSidebar({
  session,
  currentSection,
  analisisItems,
  seguimientoItems,
  personalizacionItems
}: {
  session: IAuthSession
  currentSection: DashboardSection
  analisisItems: IDashboardNavItem[]
  seguimientoItems: IDashboardNavItem[]
  personalizacionItems: IDashboardNavItem[]
}) {
  const { signOut, isPending } = useSignOut()

  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarTop}>
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
        </div>

        <nav
          className={classes.navRoot}
          aria-label='Navegación principal del dashboard'
        >
          <div className={classes.navGroup}>
            <span className={classes.navGroupLabel}>Análisis</span>
            {analisisItems.map((item) => (
              <Link
                key={item.section}
                href={item.href}
                className={`${classes.navItem} ${
                  currentSection === item.section ? classes.navItemActive : ''
                }`}
              >
                <CustomIcon name={item.icon} size={15} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className={classes.navGroup}>
            <span className={classes.navGroupLabel}>Seguimiento</span>
            {seguimientoItems.map((item) => (
              <Link
                key={item.section}
                href={item.href}
                className={`${classes.navItem} ${
                  currentSection === item.section ? classes.navItemActive : ''
                }`}
              >
                <CustomIcon name={item.icon} size={15} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className={classes.navGroup}>
            <span className={classes.navGroupLabel}>Personalización</span>
            {personalizacionItems.map((item) => (
              <Link
                key={item.section}
                href={item.href}
                className={`${classes.navItem} ${
                  currentSection === item.section ? classes.navItemActive : ''
                }`}
              >
                <CustomIcon name={item.icon} size={15} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className={classes.sidebarFooter}>
        <div className={classes.userRow}>
          <Avatar size={32} radius='xl' className={classes.sidebarAvatar}>
            {getInitials(session.user.nombreUsuario ?? '')}
          </Avatar>

          <div className={classes.userMeta}>
            <span className={classes.userName}>
              {session.user.nombreUsuario ?? 'Usuario'}
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
              onClick={signOut}
              disabled={isPending}
              aria-label='Salir'
              className={classes.sidebarLogoutButton}
            >
              <IconDoorExit size={16} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </aside>
  )
}
