import Image from 'next/image'
import { Avatar, Button, Text } from '@mantine/core'
import { IconDoorExit } from '@tabler/icons-react'
import type { IAuthSession } from '@/modules/auth/data/models/Auth'
import { getInitials } from '../../utils/getInitials'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'

export function AdminPanelNavbar({
  session,
  isSignOutPending,
  onSignOutClick
}: {
  session: IAuthSession
  isSignOutPending: boolean
  onSignOutClick: () => void
}) {
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <div className={classes.brand}>
          <div className={classes.brandMark}>
            <Image
              src='/assets/branding/logo.svg'
              alt='Dirección Provincial de Rentas'
              width={101}
              height={30}
              className={classes.brandLogo}
            />
          </div>
          <span className={classes.divider} />
          <Text size='sm' className={classes.headerTitle}>
            Panel de Administración
          </Text>
        </div>

        <div className={classes.headerActions}>
          <div className={classes.profileChip}>
            <Avatar
              size={30}
              color='blue.5'
              radius='xl'
              className={classes.profileAvatar}
            >
              {getInitials(session.user.userName)}
            </Avatar>
            <Text className={classes.profileLabel}>Administrador</Text>
          </div>

          <Button
            variant='default'
            color='gray'
            size='sm'
            radius='md'
            onClick={onSignOutClick}
            loading={isSignOutPending}
            leftSection={<IconDoorExit size={16} />}
            className={classes.secondaryButton}
          >
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
