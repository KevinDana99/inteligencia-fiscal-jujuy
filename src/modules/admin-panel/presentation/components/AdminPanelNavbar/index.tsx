import Image from 'next/image'
import { ActionIcon, Avatar, Button, Text } from '@mantine/core'
import { IconDoorExit, IconMenu2 } from '@tabler/icons-react'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelNavbar({
  profileInitials,
  profileLabel,
  isSignOutPending,
  onSignOutClick,
  onSidebarOpen
}: AdminPanelNavbarProps) {
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <ActionIcon
          variant='subtle'
          color='gray'
          size='lg'
          radius='md'
          aria-label='Abrir navegación'
          className={classes.mobileMenuButton}
          onClick={onSidebarOpen}
        >
          <IconMenu2 size={20} stroke={1.9} />
        </ActionIcon>

        <div className={classes.brand}>
          <div className={classes.brandMark}>
            <Image
              src='/assets/branding/logo.svg'
              alt='Dirección Provincial de Rentas'
              width={170}
              height={40.7}
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
              radius='xl'
              className={classes.profileAvatar}
            >
              {profileInitials}
            </Avatar>
            <Text className={classes.profileLabel}>{profileLabel}</Text>
          </div>

          <Button
            variant='default'
            color='gray'
            size='sm'
            radius='md'
            onClick={onSignOutClick}
            disabled={isSignOutPending}
            leftSection={<IconDoorExit size={16} />}
            className={classes.secondaryButton}
          >
            <span className={classes.signOutLabel}>Salir</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

interface AdminPanelNavbarProps {
  profileInitials: string
  profileLabel: string
  isSignOutPending: boolean
  onSignOutClick: () => void
  onSidebarOpen: () => void
}
