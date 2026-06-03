import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { IUnifiedRegisterSource } from './interfaces/UnifiedRegisterSource';
import { MockUnifiedRegisterSource } from './sources/mock/MockUnifiedRegisterSource';
import { RestUnifiedRegisterSource } from './sources/rest/RestUnifiedRegisterSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER !== 'false';
};

export async function createServerUnifiedRegisterSource(): Promise<IUnifiedRegisterSource> {
  if (isMockEnabled()) {
    return new MockUnifiedRegisterSource();
  }

  const session = await getServerAuthSession();

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  };

  return new RestUnifiedRegisterSource(config);
}
