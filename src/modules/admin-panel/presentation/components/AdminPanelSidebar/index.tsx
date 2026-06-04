import Link from 'next/link';
import type { ComponentType } from 'react';
import type { AdminPanelSection } from '../../../data/models/AdminPanel';
import type { AdminPanelNavHref } from '../../constants/adminPanelNavigation';
import { useAdminPanelSidebar } from '../../hooks';
import classes from '../../styles/AdminPanel.module.css';

export function AdminPanelSidebar({
  currentSection
}: AdminPanelSidebarProps) {
  const { navGroups } = useAdminPanelSidebar(currentSection)

  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <nav className={classes.navList} aria-label="Secciones del panel admin">
          {navGroups.map((group) =>
            group.label ? (
              <div key={group.id} className={classes.navGroup}>
                <span className={classes.navGroupLabel}>{group.label}</span>
                {group.items.map((item) => (
                  <AdminPanelSidebarLink key={item.section} {...item} />
                ))}
              </div>
            ) : (
              group.items.map((item) => (
                <AdminPanelSidebarLink key={item.section} {...item} />
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
  className
}: AdminPanelSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      <Icon size={18} />
      {label}
    </Link>
  )
}

interface AdminPanelSidebarProps {
  currentSection: AdminPanelSection
}

interface AdminPanelSidebarLinkProps {
  href: AdminPanelNavHref
  label: string
  Icon: ComponentType<{ size?: number }>
  className: string
}
