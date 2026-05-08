import type { ReactNode } from 'react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import type {
  DashboardSection,
  IDashboardNavItem
} from '../../../data/models/DashboardLayout';
import { DashboardNavbar } from '../DashboardNavbar';
import { DashboardSidebar } from '../DashboardSidebar';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardTemplate({
  session,
  currentSection,
  currentSectionLabel,
  analisisItems,
  seguimientoItems,
  children
}: {
  session: IAuthSession;
  currentSection: DashboardSection;
  currentSectionLabel: string;
  analisisItems: IDashboardNavItem[];
  seguimientoItems: IDashboardNavItem[];
  children: ReactNode;
}) {
  return (
    <div className={classes.page}>
      <DashboardSidebar
        session={session}
        currentSection={currentSection}
        analisisItems={analisisItems}
        seguimientoItems={seguimientoItems}
      />

      <DashboardNavbar
        session={session}
        currentSectionLabel={currentSectionLabel}
      />

      <main className={classes.main}>
        <div className={classes.content}>{children}</div>
      </main>
    </div>
  );
}
