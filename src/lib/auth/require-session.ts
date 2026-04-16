import { redirect } from 'next/navigation';
import { AUTH_ROUTES } from './constants';
import { getServerAuthSession } from './get-server-session';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function requireServerAuthSession(): Promise<IAuthSession> {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(AUTH_ROUTES.login);
  }

  return session;
}
