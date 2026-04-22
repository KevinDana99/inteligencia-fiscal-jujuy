import { IconHome, IconSettings } from '@tabler/icons-react'
import type { AdminPanelSection } from '../../../data/models/AdminPanel'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'

export function AdminPanelSidebar({
  section,
  setSection
}: {
  section: AdminPanelSection
  setSection: (section: AdminPanelSection) => void
}) {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <nav className={classes.navList} aria-label='Secciones del panel admin'>
          <button
            type='button'
            className={`${classes.navItem} ${section === 'home' ? classes.navItemActive : ''}`}
            onClick={() => setSection('home')}
          >
            <IconHome size={18} />
            Inicio
          </button>
          <button
            type='button'
            className={`${classes.navItem} ${
              section === 'settings' ? classes.navItemActive : ''
            }`}
            onClick={() => setSection('settings')}
          >
            <IconSettings size={18} />
            Configuración
          </button>
        </nav>
      </div>
    </aside>
  )
}
