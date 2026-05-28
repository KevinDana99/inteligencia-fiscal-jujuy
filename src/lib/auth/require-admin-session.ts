import { redirect } from 'next/navigation';
import { AUTH_ROUTES } from './constants';
import { requireServerAuthSession } from './require-session';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function requireAdminSession(): Promise<IAuthSession> {
  const session = await requireServerAuthSession();

  if (session.user.tipoUsuario !== 'SUPER_ADMIN') {
    redirect(AUTH_ROUTES.login as never);
  }

  return session;
}
