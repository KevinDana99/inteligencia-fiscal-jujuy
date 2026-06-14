'use server';

import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type {
  IAuthSession,
  IIamActionError
} from '../../models/Auth';

export async function refreshAuthSessionAction(): Promise<
  IAuthSession | IIamActionError
> {
  try {
    const session = await getServerAuthSession({ forceRefresh: true });

    if (!session) {
      return {
        error: 'Tu sesión expiró. Iniciá sesión para continuar.'
      };
    }

    return session;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to refresh session'
    };
  }
}
