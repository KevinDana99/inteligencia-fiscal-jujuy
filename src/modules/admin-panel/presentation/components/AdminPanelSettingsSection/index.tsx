'use client'

import { Stack } from '@mantine/core'
import { useAdminPanelSettingsSection } from '../../hooks'
import { AdminPanelAllowedDomainsCard } from './AdminPanelAllowedDomainsCard'
import { AdminPanelSettingsHeader } from './AdminPanelSettingsHeader'
import { AdminPanelSettingsInfoCard } from './AdminPanelSettingsInfoCard'

export function AdminPanelSettingsSection() {
  const {
    allowedDomains,
    domainError,
    handleRemoveDomain,
    handleChangeDomain,
    handleAddDomainSubmit,
    formRef,
    formAction,
    isPending
  } = useAdminPanelSettingsSection()

  return (
    <Stack gap='xl'>
      <AdminPanelSettingsHeader />

      <AdminPanelAllowedDomainsCard
        domains={allowedDomains}
        domainError={domainError}
        formRef={formRef}
        formAction={formAction}
        isPending={isPending}
        onRemoveDomain={handleRemoveDomain}
        onChangeDomain={handleChangeDomain}
        onAddDomainSubmit={handleAddDomainSubmit}
      />

      <AdminPanelSettingsInfoCard />
    </Stack>
  )
}
