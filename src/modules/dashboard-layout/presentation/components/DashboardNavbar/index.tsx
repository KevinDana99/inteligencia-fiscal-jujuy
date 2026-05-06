'use client';

import { Button } from '@mantine/core';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardNavbar({ currentSectionLabel }: { currentSectionLabel: string }) {
  const { signOut, isPending } = useSignOut();

  return (
    <header className={classes.header}>
      <div className={classes.headerTitleBlock}>
        <span className={classes.headerEyebrow}>Dashboard General</span>
        <span className={classes.headerTitle}>{currentSectionLabel}</span>
      </div>

      <Button variant="default" size="sm" onClick={signOut} loading={isPending}>
        Cerrar sesión
      </Button>
    </header>
  );
}
