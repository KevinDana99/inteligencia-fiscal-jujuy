import { Suspense } from 'react'
import { Center, Loader } from '@mantine/core'
import { requireAdminSession } from '@/lib/auth/require-admin-session'
import AdminPanelModule from '@/modules/admin-panel'

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <Center mih='100vh'>
          <Loader color='blue' />
        </Center>
      }
    >
      <AdminPageContent />
    </Suspense>
  )
}

async function AdminPageContent() {
  const session = await requireAdminSession()

  return <AdminPanelModule session={session} />
}
