import type { ApiClientConfig } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { AUTH_ROUTES } from './constants';
import { getServerAuthSession } from './get-server-session';

interface CreateAuthenticatedApiClientConfigParams {
  baseUrl?: string;
}

export async function createAuthenticatedApiClientConfig(
  params: CreateAuthenticatedApiClientConfigParams = {}
): Promise<ApiClientConfig> {
  const session = await getServerAuthSession();

  if (!session?.accessToken) {
    redirect(AUTH_ROUTES.login);
  }

  return {
    baseUrl: params.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session.accessToken,
    refreshAccessToken: async () => {
      const refreshedSession = await getServerAuthSession({ forceRefresh: true });

      if (!refreshedSession?.accessToken) {
        redirect(AUTH_ROUTES.login);
      }

      return refreshedSession.accessToken;
    }
  };
}
