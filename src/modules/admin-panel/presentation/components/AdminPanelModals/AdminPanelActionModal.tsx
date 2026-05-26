'use client'

import { Button, Group, Modal, Text, ThemeIcon, Title } from '@mantine/core'
import { IconDoorExit, IconTrash } from '@tabler/icons-react'
import classes from '../AdminPanelShell/AdminPanelShell.module.css'

export function AdminPanelActionModal({
  opened,
  title,
  description,
  icon,
  semantic = 'blue',
  confirmLabel,
  loading = false,
  onClose,
  onConfirm,
  error
}: {
  opened: boolean
  title: string
  description: string
  icon: 'logout' | 'delete'
  semantic?: 'blue' | 'red'
  confirmLabel: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean> | void
  error?: string | null
}) {
  const isDanger = semantic === 'red'

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      centered
      withCloseButton={false}
      classNames={{
        header: classes.modalNativeHeader,
        content: classes.confirmModalContent,
        body: classes.confirmModalBody,
        overlay: classes.modalOverlay
      }}
    >
      <div className={classes.confirmModalSection}>
        <ThemeIcon
          size={52}
          radius='xl'
          variant='light'
          color={isDanger ? 'red' : 'blue'}
          className={
            isDanger ? classes.confirmThemeIconDanger : classes.confirmThemeIcon
          }
        >
          {icon === 'logout' ? (
            <IconDoorExit size={24} />
          ) : (
            <IconTrash size={24} />
          )}
        </ThemeIcon>

        <Title order={3} className={classes.confirmModalTitle}>
          {title}
        </Title>
        <Text className={classes.confirmModalDescription}>{description}</Text>
      </div>

      <div className={classes.confirmModalFooter}>
        <Group justify='center' gap={10}>
          <Button
            variant='default'
            size='sm'
            onClick={onClose}
            className={classes.modalCancelButton}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            color={isDanger ? 'red' : 'blue'}
            onClick={onConfirm}
            loading={loading}
            leftSection={
              icon === 'logout' ? <IconDoorExit size={16} /> : undefined
            }
            className={
              isDanger
                ? classes.confirmDangerButton
                : classes.confirmPrimaryButton
            }
          >
            {confirmLabel}
          </Button>
        </Group>
        {error ? <Text className={classes.modalError}>{error}</Text> : null}
      </div>
    </Modal>
  )
}
