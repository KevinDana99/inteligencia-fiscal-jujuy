import { Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { requireAdminSession } from '@/lib/auth/require-admin-session';
import AdminPanelModule from '@/modules/admin-panel';

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <Center mih="100vh">
          <Loader color="blue" />
        </Center>
      }
    >
      <AdminSettingsPageContent />
    </Suspense>
  );
}

async function AdminSettingsPageContent() {
  const session = await requireAdminSession();

  return <AdminPanelModule session={session} section="settings" />;
}
