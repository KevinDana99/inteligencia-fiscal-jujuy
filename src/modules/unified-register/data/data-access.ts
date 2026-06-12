import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
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

  const config = await createAuthenticatedApiClientConfig();

  return new RestUnifiedRegisterSource(config);
}
