'use server';

import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { IAuthSession, IModuleQueryResult } from '../../models/Auth';

export async function getAuthSessionAction(): Promise<
  IModuleQueryResult<IAuthSession>
> {
  try {
    const session = await getServerAuthSession();

    return {
      data: session
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
