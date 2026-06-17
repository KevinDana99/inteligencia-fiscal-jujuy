import { readServerAuthSession } from './cookies';
import { clearServerAuthCookies, setServerAuthCookies } from './cookies';
import { refreshAuthSession } from './refresh-session';
import {
  composeAuthSession,
  isSessionExpired,
  isSessionExpiredOrWithinSkew,
  mapIamCurrentContextResponseToAuthUser
} from './session-mapper';
import { createServerAuthSource } from '@/modules/auth/data/data-access';
import type {
  IAuthSession,
  ISerializedAuthSession
} from '@/modules/auth/data/models/Auth';

export interface GetServerAuthSessionOptions {
  forceRefresh?: boolean;
}

async function refreshSerializedAuthSession(
  session: ISerializedAuthSession
): Promise<ISerializedAuthSession | null> {
  if (!session.refreshToken || isSessionExpired(session.refreshTokenExpiresAt)) {
    await clearServerAuthCookies();
    return null;
  }

  let refreshedSession: ISerializedAuthSession | null;

  try {
    refreshedSession = await refreshAuthSession({
      refrescarToken: session.refreshToken
    });
  } catch {
    await clearServerAuthCookies();
    return null;
  }

  if (!refreshedSession) {
    await clearServerAuthCookies();
    return null;
  }

  await setServerAuthCookies(refreshedSession);
  return refreshedSession;
}

export async function getServerAuthSession(
  options: GetServerAuthSessionOptions = {}
): Promise<IAuthSession | null> {
  let session = await readServerAuthSession();

  if (!session?.accessToken) {
    return null;
  }

  if (
    options.forceRefresh ||
    isSessionExpiredOrWithinSkew(session.accessTokenExpiresAt)
  ) {
    session = await refreshSerializedAuthSession(session);

    if (!session) {
      return null;
    }
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
