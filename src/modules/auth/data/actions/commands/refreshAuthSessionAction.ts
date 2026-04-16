'use server';

import { mapIamSessionResponseToAuthSession } from '@/lib/auth/session-mapper';
import { readServerAuthSession, setServerAuthCookies } from '@/lib/auth/cookies';
import { createServerAuthSource } from '../../data-access';
import type {
  IIamActionError,
  IIamRefreshSessionResponse
} from '../../models/Auth';

export async function refreshAuthSessionAction(): Promise<
  IIamRefreshSessionResponse | IIamActionError
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

    await setServerAuthCookies(mapIamSessionResponseToAuthSession(response));

    return response;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to refresh session'
    };
  }
}
