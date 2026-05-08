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
        <div className={classes.brandContainer}>
          <div className={classes.brand}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 54 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={classes.brandLogo}
              aria-hidden="true"
            >
              <path
                d="M53.8197 30.8199C53.8197 43.5199 42.7897 56.4899 27.4697 56.4899C22.3197 56.4899 18.5397 55.1599 17.6497 52.3099C17.5497 51.9699 17.3197 51.4999 17.8597 51.7299C19.9497 52.6299 22.6697 53.0199 25.6497 53.0199C38.9397 53.0199 51.5997 41.6399 51.5997 27.5799C51.5997 22.7199 50.1597 18.1799 47.6297 14.3799C51.5997 18.6199 53.8197 23.7299 53.8197 30.8199Z"
                fill="#99E0F7"
              />
              <path
                d="M0 26.52C0 12.73 11.75 0 25.62 0C32.54 0 36.99 1.55 38.21 5.55C38.62 6.96 38.31 7.42 37.82 7.08C34.62 4.8 31.02 3.67001 25.95 3.67001C12.76 3.67001 2.44 13.76 2.44 27.06C2.44 34.83 6.21 41.86 12.12 46.25C5.04 41.75 0 34.85 0 26.52Z"
                fill="#008BD2"
              />
              <path
                d="M5.02051 27.4202C5.02051 14.8502 15.2105 4.66016 27.7805 4.66016C40.3505 4.66016 50.5405 14.8502 50.5405 27.4202C50.5405 39.9902 40.3505 50.1802 27.7805 50.1802C15.2105 50.1802 5.02051 39.9902 5.02051 27.4202Z"
                fill="url(#dashboardLogoPaint0)"
              />
              <path
                d="M7.46973 13.4199C12.0997 6.95994 18.0097 5.68994 25.6197 5.68994C34.5997 5.68994 40.5397 10.5499 40.5397 18.5599C40.5397 24.4899 36.6597 28.3499 31.9997 29.7099L42.1197 45.8599C40.4197 47.2199 39.1397 47.4199 37.2397 47.4199C33.7397 47.4199 31.8497 46.0599 30.0097 42.9499L22.8397 31.6999H18.1397V42.0799H7.46973V13.4199Z"
                fill="url(#dashboardLogoPaint1)"
              />
              <path
                d="M7.46973 12.4203C11.6897 6.89027 17.3497 5.28027 25.3197 5.28027C34.6997 5.28027 39.6397 9.92027 39.6397 17.9303C39.6397 23.8603 35.5597 27.8203 31.3497 29.0203L41.7297 45.6203C40.6497 46.3203 38.9497 46.6203 37.0497 46.6203C33.5497 46.6203 32.0497 45.4603 30.0097 42.1503L21.9397 30.7003H16.5697V41.3803H7.46973V12.4203Z"
                fill="url(#dashboardLogoPaint2)"
              />
              <path
                d="M16.5703 15.8203V23.5903H23.3703C26.4703 23.5903 28.3003 21.6803 28.3003 19.3503C28.3003 16.7103 26.4103 15.8203 22.7903 15.8203H16.5703Z"
                fill="url(#dashboardLogoPaint3)"
              />
              <defs>
                <linearGradient
                  id="dashboardLogoPaint0"
                  x1="27.78"
                  y1="4.72"
                  x2="27.78"
                  y2="50.22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#009EE0" />
                  <stop offset="1" stopColor="#005782" />
                </linearGradient>
                <linearGradient
                  id="dashboardLogoPaint1"
                  x1="24.8"
                  y1="5.32"
                  x2="24.8"
                  y2="47.42"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#BCBEC0" />
                  <stop offset="1" stopColor="#939598" />
                </linearGradient>
                <linearGradient
                  id="dashboardLogoPaint2"
                  x1="24.6"
                  y1="5.28"
                  x2="24.6"
                  y2="46.62"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F9F9F9" />
                  <stop offset="1" stopColor="#D1D3D4" />
                </linearGradient>
                <linearGradient
                  id="dashboardLogoPaint3"
                  x1="22.43"
                  y1="15.82"
                  x2="22.43"
                  y2="23.62"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#81CFF4" />
                  <stop offset="1" stopColor="#0074A6" />
                </linearGradient>
              </defs>
            </svg>

            <div className={classes.brandText}>
              <span className={classes.brandTitle}>Inteligencia Fiscal</span>
              <span className={classes.brandSubtitle}>DGR Jujuy</span>
            </div>
          </div>
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
