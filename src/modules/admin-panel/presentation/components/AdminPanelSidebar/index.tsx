import Link from 'next/link';
import { IconHome, IconSettings } from '@tabler/icons-react';
import type { AdminPanelSection } from '../../../data/models/AdminPanel';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelSidebar({
  currentSection
}: {
  currentSection: AdminPanelSection
}) {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <nav className={classes.navList} aria-label="Secciones del panel admin">
          <Link
            href="/admin"
            className={`${classes.navItem} ${
              currentSection === 'dashboard' ? classes.navItemActive : ''
            }`}
          >
            <IconHome size={18} />
            Inicio
          </Link>
          <Link
            href="/admin/configuracion"
            className={`${classes.navItem} ${
              currentSection === 'settings' ? classes.navItemActive : ''
            }`}
          >
            <IconSettings size={18} />
            Configuración
          </Link>
        </nav>
      </div>
    </aside>
  );
}
