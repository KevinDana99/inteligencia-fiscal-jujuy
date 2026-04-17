import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import LoginForm from '@/modules/auth/presentation/components/LoginForm';
import { AUTH_MODE, AUTH_ROUTES } from '@/lib/auth/constants';
import { getServerAuthSession } from '@/lib/auth/get-server-session';

export default async function LoginPageGate({
  searchParams
}: {
  searchParams: Promise<{
    mode?: string;
  }>;
}) {
  await connection();
  const resolvedSearchParams = await searchParams;
  const session = await getServerAuthSession();
  const mode =
    resolvedSearchParams.mode === AUTH_MODE.admin ? AUTH_MODE.admin : AUTH_MODE.user;

  if (mode === AUTH_MODE.admin) {
    if (session?.user.role === 'admin') {
      redirect(AUTH_ROUTES.admin);
    }

    return <LoginForm mode={mode} />;
  }

  if (session) {
    redirect(AUTH_ROUTES.home);
  }

  return <LoginForm mode={mode} />;
}
