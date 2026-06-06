'use client';

import { IconChevronRight } from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { useDashboardNavbarActionContext } from '../../contexts/DashboardNavbarActionContext';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardNavbar({
  session,
  currentSectionLabel
}: {
  session: IAuthSession;
  currentSectionLabel: string;
}) {
  const { registerNavbarActionTarget } = useDashboardNavbarActionContext();

  return (
    <header className={classes.header}>
      <div className={classes.breadcrumb}>
        <span className={classes.breadcrumbBase}>Sistema IF</span>
        <IconChevronRight size={14} stroke={1.8} className={classes.breadcrumbDivider} />
        <span className={classes.breadcrumbCurrent}>{currentSectionLabel}</span>
      </div>

      <div className={classes.headerActions}>
        <div
          ref={registerNavbarActionTarget}
          className={classes.headerActionSlot}
        />
      </div>
    </header>
  );
}
