'use client';

import { Avatar, Button, Group, Text } from '@mantine/core';
import { IconChevronRight, IconDoorExit, IconPlus } from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import type { DashboardSection } from '../../../data/models/DashboardLayout';
import { useDashboardNavbarActionContext } from '../../contexts/DashboardNavbarActionContext';
import { getInitials } from '../../utils/getInitials';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardNavbar({
  session,
  currentSection,
  currentSectionLabel
}: {
  session: IAuthSession;
  currentSection: DashboardSection;
  currentSectionLabel: string;
}) {
  const { signOut, isPending } = useSignOut();
  const { explorerSelectedCount } = useDashboardNavbarActionContext();

  return (
    <header className={classes.header}>
      <div className={classes.breadcrumb}>
        <span className={classes.breadcrumbBase}>Sistema IF</span>
        <IconChevronRight size={14} stroke={1.8} className={classes.breadcrumbDivider} />
        <span className={classes.breadcrumbCurrent}>{currentSectionLabel}</span>
      </div>

      <div className={classes.headerActions}>
        {currentSection === 'explorar-padron' ? (
          <Button
            size="sm"
            radius="xl"
            leftSection={<IconPlus size={16} />}
            className={classes.headerPrimaryActionButton}
          >
            Crear lote con {explorerSelectedCount} resultados
          </Button>
        ) : null}

        <Group gap="xs" className={classes.profileChip}>
          <Avatar size={30} radius="xl" className={classes.profileAvatar}>
            {getInitials(session.user.nombreUsuario ?? '')}
          </Avatar>
          <Text size="sm" fw={600} className={classes.profileLabel}>
            {session.user.nombreUsuario ?? 'Usuario'}
          </Text>
        </Group>

        <Button
          variant="default"
          color="gray"
          size="sm"
          radius="md"
          onClick={signOut}
          disabled={isPending}
          leftSection={<IconDoorExit size={16} />}
          className={classes.headerLogoutButton}
        >
          Salir
        </Button>
      </div>
    </header>
  );
}
