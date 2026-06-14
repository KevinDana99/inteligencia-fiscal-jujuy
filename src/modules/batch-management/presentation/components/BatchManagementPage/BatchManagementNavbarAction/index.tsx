'use client'

import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DashboardNavbarActionPortal } from '@/modules/dashboard-layout/presentation/contexts'
import classes from '../BatchManagementPage.module.css'

type BatchManagementNavbarActionProps = {
  onOpenCreateModal: () => void
}

export function BatchManagementNavbarAction({
  onOpenCreateModal
}: BatchManagementNavbarActionProps) {
  return (
    <DashboardNavbarActionPortal>
      <Button
        variant="filled"
        color="blue"
        size="sm"
        radius="xl"
        leftSection={<IconPlus size={14} />}
        className={classes.createButton}
        onClick={() => onOpenCreateModal()}
      >
        Nuevo Lote
      </Button>
    </DashboardNavbarActionPortal>
  )
}
