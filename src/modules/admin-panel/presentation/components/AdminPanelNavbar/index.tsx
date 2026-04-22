import Image from 'next/image';
import { Avatar, Button, Text } from '@mantine/core';
import { IconLogout2 } from '@tabler/icons-react';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';
import { getInitials } from '../../utils/getInitials';
import classes from '../AdminPanelShell/AdminPanelShell.module.css';

export function AdminPanelNavbar({
  session,
  isSignOutPending,
  signOut
}: {
  session: IAuthSession;
  isSignOutPending: boolean;
  signOut: () => void;
}) {
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <div className={classes.brand}>
          <div className={classes.brandMark}>
            <Image
              src="/assets/branding/logo.svg"
              alt="Dirección Provincial de Rentas"
              width={96}
              height={32}
              className={classes.brandLogo}
            />
          </div>
          <span className={classes.divider} />
          <Text className={classes.headerTitle}>Panel de Administración</Text>
        </div>

        <div className={classes.headerActions}>
          <div className={classes.profileChip}>
            <Avatar size={30} color="indigo" radius="xl" className={classes.profileAvatar}>
              {getInitials(session.user.userName)}
            </Avatar>
            <Text className={classes.profileLabel}>Administrador</Text>
          </div>

          <Button
            variant="default"
            color="gray"
            radius="md"
            leftSection={<IconLogout2 size={16} stroke={1.8} />}
            onClick={signOut}
            loading={isSignOutPending}
            className={classes.secondaryButton}
          >
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
