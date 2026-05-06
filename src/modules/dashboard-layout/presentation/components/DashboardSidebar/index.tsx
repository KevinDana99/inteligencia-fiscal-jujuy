import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@mantine/core';
import {
  IconActivity,
  IconClockHour4,
  IconLayoutGrid,
  IconSearch
} from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type {
  DashboardSection,
  IDashboardNavItem
} from '../../../data/models/DashboardLayout';
import { getInitials } from '../../utils/getInitials';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

function getIcon(icon: IDashboardNavItem['icon']) {
  switch (icon) {
    case 'grid':
      return <IconLayoutGrid size={15} />;
    case 'activity':
      return <IconActivity size={15} />;
    case 'clock':
      return <IconClockHour4 size={15} />;
    case 'search':
    default:
      return <IconSearch size={15} />;
  }
}

function getRoleLabel(role: IAuthSession['user']['role']) {
  return role === 'admin' ? 'Administrador' : 'Analista Fiscal';
}

export function DashboardSidebar({
  session,
  currentSection,
  analisisItems,
  seguimientoItems
}: {
  session: IAuthSession;
  currentSection: DashboardSection;
  analisisItems: IDashboardNavItem[];
  seguimientoItems: IDashboardNavItem[];
}) {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarTop}>
        <div className={classes.brand}>
          <Image
            src="/assets/branding/logo.svg"
            alt="Dirección Provincial de Rentas"
            width={101}
            height={30}
            className={classes.brandLogo}
          />
        </div>

        <nav className={classes.navRoot} aria-label="Navegación principal del dashboard">
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
                {getIcon(item.icon)}
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
                {getIcon(item.icon)}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className={classes.sidebarFooter}>
        <div className={classes.userRow}>
          <Avatar size={32} radius="xl" color="blue">
            {getInitials(session.user.userName)}
          </Avatar>

          <div className={classes.userMeta}>
            <span className={classes.userName}>{session.user.userName}</span>
            <span className={classes.userRole}>{getRoleLabel(session.user.role)}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
