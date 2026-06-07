'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type {
  DashboardSection,
  IDashboardNavItem
} from '../../../data/models/DashboardLayout';
import { DashboardNavbar } from '../DashboardNavbar';
import { DashboardSidebar } from '../DashboardSidebar';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

interface DashboardTemplateProps {
  session: IAuthSession;
  currentSection: DashboardSection;
  currentSectionLabel: string;
  analisisItems: IDashboardNavItem[];
  seguimientoItems: IDashboardNavItem[];
  personalizacionItems: IDashboardNavItem[];
  children: ReactNode;
}

export function DashboardTemplate({
  session,
  currentSection,
  currentSectionLabel,
  analisisItems,
  seguimientoItems,
  personalizacionItems,
  children
}: DashboardTemplateProps) {
  const [
    isSidebarOpen,
    { close: closeSidebar, open: openSidebar }
  ] = useDisclosure(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [closeSidebar]);

  return (
    <div className={classes.page}>
      <DashboardSidebar
        session={session}
        currentSection={currentSection}
        analisisItems={analisisItems}
        seguimientoItems={seguimientoItems}
        personalizacionItems={personalizacionItems}
        isMobileOpen={isSidebarOpen}
        onNavigate={closeSidebar}
      />

      <button
        type="button"
        aria-label="Cerrar navegación"
        className={`${classes.sidebarOverlay} ${
          isSidebarOpen ? classes.sidebarOverlayVisible : ''
        }`}
        onClick={closeSidebar}
      />

      <DashboardNavbar
        currentSectionLabel={currentSectionLabel}
        onSidebarOpen={openSidebar}
      />

      <main
        className={`${classes.main} ${
          isSidebarOpen ? classes.mainMobileSidebarOpen : ''
        }`}
      >
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
