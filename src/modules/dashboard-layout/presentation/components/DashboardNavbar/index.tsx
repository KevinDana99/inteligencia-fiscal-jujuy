'use client';

import { Avatar, Button, Group, Text } from '@mantine/core';
import { IconChevronRight, IconDoorExit } from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { useSignOut } from '@/modules/auth/presentation/hooks';
import { getInitials } from '../../utils/getInitials';
import classes from '../DashboardLayoutShell/DashboardLayoutShell.module.css';

export function DashboardNavbar({
  session,
  currentSectionLabel
}: {
  session: IAuthSession;
  currentSectionLabel: string;
}) {
  const { signOut, isPending } = useSignOut();

  return (
    <header className={classes.header}>
      <div className={classes.breadcrumb}>
        <span className={classes.breadcrumbBase}>Sistema IF</span>
        <IconChevronRight size={14} stroke={1.8} className={classes.breadcrumbDivider} />
        <span className={classes.breadcrumbCurrent}>{currentSectionLabel}</span>
      </div>

      <div className={classes.headerActions}>
        <Group gap="xs" className={classes.profileChip}>
          <Avatar size={30} radius="xl" className={classes.profileAvatar}>
            {getInitials(session.user.userName)}
          </Avatar>
          <Text size="sm" fw={600} className={classes.profileLabel}>
            {session.user.userName}
          </Text>
        </Group>

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
