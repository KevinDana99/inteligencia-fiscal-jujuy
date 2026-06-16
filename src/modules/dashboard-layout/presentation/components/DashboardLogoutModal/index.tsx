'use client'

import { AdminPanelActionModal } from '@/modules/admin-panel/presentation/components/AdminPanelModals/AdminPanelActionModal'

interface DashboardLogoutModalProps {
  opened: boolean
  title: string
  description: string
  confirmLabel: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean> | void
}

export function DashboardLogoutModal({
  opened,
  title,
  description,
  confirmLabel,
  loading = false,
  onClose,
  onConfirm
}: DashboardLogoutModalProps) {
  return (
    <AdminPanelActionModal
      opened={opened}
      title={title}
      description={description}
      icon='logout'
      semantic='blue'
      confirmLabel={confirmLabel}
      loading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
