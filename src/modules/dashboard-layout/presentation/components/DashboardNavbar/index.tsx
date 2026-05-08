'use client';

import { Button } from '@mantine/core';
import { IconChevronRight, IconDoorExit, IconPlus } from '@tabler/icons-react';
import type { DashboardSection } from '../../../data/models/DashboardLayout';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardNavbar({
  currentSection,
  currentSectionLabel
}: {
  currentSection: DashboardSection;
  currentSectionLabel: string;
}) {
  const { signOut, isPending } = useSignOut();
  const showCreateLoteButton = currentSection === 'gestion-de-lotes';

  return (
    <header className={classes.header}>
      <div className={classes.breadcrumb}>
        <span className={classes.breadcrumbBase}>Sistema IF</span>
        <IconChevronRight size={14} stroke={1.8} className={classes.breadcrumbDivider} />
        <span className={classes.breadcrumbCurrent}>{currentSectionLabel}</span>
      </div>

      <div className={classes.headerActions}>
        {showCreateLoteButton ? (
          <Button
            leftSection={<IconPlus size={16} />}
            radius="xl"
            size="sm"
            className={classes.headerActionButton}
          >
            Nuevo Lote
          </Button>
        ) : null}

        <Button
          variant="default"
          color="gray"
          size="sm"
          radius="md"
          onClick={signOut}
          loading={isPending}
          leftSection={<IconDoorExit size={16} />}
          className={classes.headerLogoutButton}
        >
          Salir
        </Button>
      </div>
    </header>
  );
}
