import { readServerAuthSession } from './cookies';
import { isSessionExpired } from './session-mapper';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function getServerAuthSession(): Promise<IAuthSession | null> {
  const session = await readServerAuthSession();

  if (!session?.accessToken || isSessionExpired(session.accessTokenExpiresAt)) {
    return null;
  }

  return session;
}
