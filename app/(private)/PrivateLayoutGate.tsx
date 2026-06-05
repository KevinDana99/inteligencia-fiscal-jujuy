import type { ReactNode } from 'react'
import { connection } from 'next/server'
import DashboardLayoutModule from '@/modules/dashboard-layout'
import { requirePrivateDashboardSession } from '@/lib/auth/require-private-dashboard-session'
import { getConfigurationAction } from '@/modules/dashboard-layout/data/actions/queries/getConfigurationAction'

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
      initialConfig={configurationResult.data}
    >
      {children}
    </DashboardLayoutModule>
  )
}
