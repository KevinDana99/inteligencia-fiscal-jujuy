import { redirect } from 'next/navigation';
import { AUTH_MODE, AUTH_ROUTES } from './constants';
import { requireServerAuthSession } from './require-session';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function requireAdminSession(): Promise<IAuthSession> {
  const session = await requireServerAuthSession();

  if (session.user.role !== 'admin') {
    redirect(`${AUTH_ROUTES.login}?mode=${AUTH_MODE.admin}` as never);
  }

  return session;
}
