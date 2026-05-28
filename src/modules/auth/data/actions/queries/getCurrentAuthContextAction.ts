'use server';

import { createServerAuthSource } from '../../data-access';
import type {
  IAuthUser,
  IIamActionError
} from '../../models/Auth';
import { mapIamCurrentContextResponseToAuthUser } from '@/lib/auth/session-mapper';

export async function getCurrentAuthContextAction(
  accessToken: string
): Promise<IAuthUser | IIamActionError> {
  try {
    const source = await createServerAuthSource();
    const response = await source.getCurrentContext(accessToken);

    return mapIamCurrentContextResponseToAuthUser(response);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to fetch current context'
    };
  }
}
