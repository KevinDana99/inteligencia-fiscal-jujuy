'use client';

import { ActionIcon } from '@mantine/core';
import { IconChevronRight, IconMenu2 } from '@tabler/icons-react';
import { useDashboardNavbarActionContext } from '../../contexts/DashboardNavbarActionContext';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

interface DashboardNavbarProps {
  currentSectionLabel: string;
  onSidebarOpen: () => void;
}

export function DashboardNavbar({
  currentSectionLabel,
  onSidebarOpen
}: DashboardNavbarProps) {
  const { registerNavbarActionTarget } = useDashboardNavbarActionContext();

  return (
    <header className={classes.header}>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Abrir navegación"
        className={classes.mobileMenuButton}
        onClick={onSidebarOpen}
      >
        <IconMenu2 size={20} stroke={1.9} />
      </ActionIcon>

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
