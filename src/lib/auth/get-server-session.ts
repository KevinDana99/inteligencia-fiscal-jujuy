import { readServerAuthSession } from './cookies';
import { clearServerAuthCookies, setServerAuthCookies } from './cookies';
import { refreshAuthSession } from './refresh-session';
import {
  composeAuthSession,
  isSessionExpired,
  mapIamCurrentContextResponseToAuthUser
} from './session-mapper';
import { createServerAuthSource } from '@/modules/auth/data/data-access';
import type { IAuthSession } from '@/modules/auth/data/models/Auth';

export async function getServerAuthSession(): Promise<IAuthSession | null> {
  let session = await readServerAuthSession();

  if (!session?.accessToken) {
    return null;
  }

  if (isSessionExpired(session.accessTokenExpiresAt)) {
    if (!session.refreshToken || isSessionExpired(session.refreshTokenExpiresAt)) {
      await clearServerAuthCookies();
      return null;
    }

    const refreshedSession = await refreshAuthSession({
      refrescarToken: session.refreshToken
    });

    if (!refreshedSession) {
      await clearServerAuthCookies();
      return null;
    }

    session = refreshedSession;
    await setServerAuthCookies(session);
  }

  try {
    const source = await createServerAuthSource();
    const currentContext = await source.getCurrentContext(session.accessToken);

    return composeAuthSession(
      session,
      mapIamCurrentContextResponseToAuthUser(currentContext)
    );
  } catch {
    await clearServerAuthCookies();
    return null;
  }
}
