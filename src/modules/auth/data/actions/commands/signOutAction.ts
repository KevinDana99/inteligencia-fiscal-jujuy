'use server';

import { redirect } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants';
import { clearServerAuthCookies, readServerAuthSession } from '@/lib/auth/cookies';
import { createServerAuthSource } from '../../data-access';

export async function signOutAction() {
  const source = await createServerAuthSource();
  const session = await readServerAuthSession();

  try {
    await source.signOut(session?.refreshToken);
  } finally {
    await clearServerAuthCookies();
  }

  redirect(AUTH_ROUTES.login);
}
