import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Center, Loader } from '@mantine/core';
import { AUTH_MODE, AUTH_ROUTES } from '@/lib/auth/constants';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import AdminPanelModule from '@/modules/admin-panel';

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <Center mih="100vh">
          <Loader color="blue" />
        </Center>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}

async function AdminPageContent() {
  await connection();
  const session = await getServerAuthSession();

  if (session?.user.role !== 'admin') {
    redirect(`${AUTH_ROUTES.login}?mode=${AUTH_MODE.admin}` as never);
  }

  return <AdminPanelModule session={session} />;
}
