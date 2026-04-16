'use server';

import { clearServerAuthCookies, readServerAuthSession } from '@/lib/auth/cookies';
import { createServerAuthSource } from '../../data-access';
import type { ICommandResult } from '../../models/Auth';

export async function signOutAction(): Promise<ICommandResult> {
  const source = await createServerAuthSource();
  const session = await readServerAuthSession();
  const result = await source.signOut(session?.refreshToken);

  await clearServerAuthCookies();

  return result.success ? result : { success: true };
}
