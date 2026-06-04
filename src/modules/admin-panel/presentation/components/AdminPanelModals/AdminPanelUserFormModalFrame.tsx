import type { ReactNode } from 'react'
import { Modal, Stack, Text, Title } from '@mantine/core'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUserFormModalFrame({
  opened,
  title,
  subtitle,
  onClose,
  children
}: AdminPanelUserFormModalFrameProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Stack gap='xs'>
          <Title order={3} className={classes.modalTitle}>
            {title}
          </Title>
          <Text className={classes.modalSubtitle}>{subtitle}</Text>
        </Stack>
      }
      centered
      classNames={{
        header: classes.modalHeader,
        content: classes.modalContent,
        body: classes.modalBody,
        overlay: classes.modalOverlay
      }}
    >
      {children}
    </Modal>
  )
}

interface AdminPanelUserFormModalFrameProps {
  opened: boolean
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
}
