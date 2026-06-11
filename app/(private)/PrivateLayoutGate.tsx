import type { ReactNode } from 'react'
import { connection } from 'next/server'
import DashboardLayoutModule from '@/modules/dashboard-layout'
import { getConfigurationAction } from '@/modules/configuration-module/data/actions/queries/getConfigurationAction'
import { DEFAULT_CONFIGURATION } from '@/modules/configuration-module/presentation/constants'
import { requirePrivateDashboardSession } from '@/lib/auth/require-private-dashboard-session'

export default async function PrivateLayoutGate({
  children
}: {
  children: ReactNode
}) {
  await connection()
  const session = await requirePrivateDashboardSession()
  const configurationResult = await getConfigurationAction()

  return (
    <DashboardLayoutModule
      session={session}
      initialConfig={configurationResult.data ?? DEFAULT_CONFIGURATION}
    >
      {children}
    </DashboardLayoutModule>
  )
}
