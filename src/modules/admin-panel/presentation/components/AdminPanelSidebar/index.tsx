import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { ActionIcon, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { AdminPanelSection } from '../../../data/models/AdminPanel';
import type { AdminPanelNavHref } from '../../constants/adminPanelNavigation';
import { useAdminPanelSidebar } from '../../hooks';
import classes from '../../styles/AdminPanel.module.css';

export function AdminPanelSidebar({
  currentSection,
  isMobileOpen,
  onNavigate
}: AdminPanelSidebarProps) {
  const { navGroups } = useAdminPanelSidebar(currentSection)

  return (
    <aside
      className={`${classes.sidebar} ${
        isMobileOpen ? classes.sidebarMobileOpen : ''
      }`}
    >
      <div className={classes.sidebarMobileHeader}>
        <div className={classes.sidebarMobileBrand}>
          <Image
            src='/assets/branding/logo.svg'
            alt='Dirección Provincial de Rentas'
            width={170}
            height={40.7}
            className={classes.sidebarMobileLogo}
          />
          <Text className={classes.sidebarMobileTitle}>
            Panel de Administración
          </Text>
        </div>

        <ActionIcon
          variant='subtle'
          color='gray'
          size='lg'
          radius='md'
          aria-label='Cerrar navegación'
          className={classes.sidebarCloseButton}
          onClick={onNavigate}
        >
          <IconX size={18} stroke={1.9} />
        </ActionIcon>
      </div>

      <div className={classes.sidebarInner}>
        <nav className={classes.navList} aria-label="Secciones del panel admin">
          {navGroups.map((group) =>
            group.label ? (
              <div key={group.id} className={classes.navGroup}>
                <span className={classes.navGroupLabel}>{group.label}</span>
                {group.items.map((item) => (
                  <AdminPanelSidebarLink
                    key={item.section}
                    {...item}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              group.items.map((item) => (
                <AdminPanelSidebarLink
                  key={item.section}
                  {...item}
                  onNavigate={onNavigate}
                />
              ))
            )
          )}
        </nav>
      </div>
    </aside>
  );
}

function AdminPanelSidebarLink({
  href,
  label,
  Icon,
  className,
  onNavigate
}: AdminPanelSidebarLinkProps) {
  return (
    <Link href={href} className={className} onClick={onNavigate}>
      <Icon size={18} />
      {label}
    </Link>
  )
}

interface AdminPanelSidebarProps {
  currentSection: AdminPanelSection
  isMobileOpen: boolean
  onNavigate: () => void
}

interface AdminPanelSidebarLinkProps {
  href: AdminPanelNavHref
  label: string
  Icon: ComponentType<{ size?: number }>
  className: string
  onNavigate: () => void
}
