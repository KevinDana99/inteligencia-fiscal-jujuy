'use server';

import {
  composeAuthSession,
  mapIamCurrentContextResponseToAuthUser,
  mapIamSessionResponseToSerializedAuthSession
} from '@/lib/auth/session-mapper';
import { readServerAuthSession, setServerAuthCookies } from '@/lib/auth/cookies';
import { createServerAuthSource } from '../../data-access';
import type {
  IAuthSession,
  IIamActionError
} from '../../models/Auth';

export async function refreshAuthSessionAction(): Promise<
  IAuthSession | IIamActionError
> {
  try {
    const source = await createServerAuthSource();
    const session = await readServerAuthSession();

    if (!session?.refreshToken) {
      return {
        error: 'No refresh token available'
      };
    }

    const response = await source.refreshSession({
      refrescarToken: session.refreshToken
    });

    const serializedSession = mapIamSessionResponseToSerializedAuthSession(response);
    await setServerAuthCookies(serializedSession);
    const currentContext = await source.getCurrentContext(serializedSession.accessToken);

    return composeAuthSession(
      serializedSession,
      mapIamCurrentContextResponseToAuthUser(currentContext)
    );
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to refresh session'
    };
  }
}
