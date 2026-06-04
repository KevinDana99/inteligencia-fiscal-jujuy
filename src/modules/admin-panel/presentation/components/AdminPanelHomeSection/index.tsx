'use client'

import { Stack } from '@mantine/core'
import type { IAdminPanelData } from '../../../data/models/AdminPanel'
import { useAdminPanelShell } from '../../hooks'
import { AdminPanelModals } from '../AdminPanelModals'
import { AdminPanelUserGestionTable } from '../AdminPanelUserGestionTable'
import { AdminPanelHomeHeader } from './AdminPanelHomeHeader'
import { AdminPanelHomeSectionLoader } from './AdminPanelHomeSectionLoader'

export { AdminPanelHomeSectionLoader }

export function AdminPanelHomeSection({
  data,
  formattedDate
}: AdminPanelHomeSectionProps) {
  const adminPanelShell = useAdminPanelShell(data)

  return (
    <>
      <Stack gap='xl'>
        <AdminPanelHomeHeader formattedDate={formattedDate} />
        <AdminPanelUserGestionTable
          {...adminPanelShell}
        />
      </Stack>
      <AdminPanelModals
        {...adminPanelShell}
      />
    </>
  )
}

interface AdminPanelHomeSectionProps {
  data: IAdminPanelData
  formattedDate: string
}
