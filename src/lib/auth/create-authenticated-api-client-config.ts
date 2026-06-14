import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from './get-server-session';

interface CreateAuthenticatedApiClientConfigParams {
  baseUrl?: string;
}

export async function createAuthenticatedApiClientConfig(
  params: CreateAuthenticatedApiClientConfigParams = {}
): Promise<ApiClientConfig> {
  const session = await getServerAuthSession();

  return {
    baseUrl: params.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken,
    refreshAccessToken: async () => {
      const refreshedSession = await getServerAuthSession({ forceRefresh: true });
      return refreshedSession?.accessToken ?? null;
    }
  };
}
