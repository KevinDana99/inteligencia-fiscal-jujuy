import { redirect } from 'next/navigation';
import { AUTH_ROUTES, USER_ROLES } from './constants';
import { requireServerAuthSession } from './require-session';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function requirePrivateDashboardSession(): Promise<IAuthSession> {
  const session = await requireServerAuthSession();

  if (session.user.tipoUsuario === USER_ROLES.ADMIN) {
    redirect(AUTH_ROUTES.admin as never);
  }

  if (session.user.tipoUsuario !== USER_ROLES.FISCAL_ANALYST) {
    redirect(AUTH_ROUTES.login as never);
  }

  return session;
}
