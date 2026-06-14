import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
import { UNIFIED_REGISTER_DATA_SOURCE_ENV } from './constants/unifiedRegisterDataSource';
import type { IUnifiedRegisterSource } from './interfaces/UnifiedRegisterSource';
import { MockUnifiedRegisterSource } from './sources/mock/MockUnifiedRegisterSource';
import { RestUnifiedRegisterSource } from './sources/rest/RestUnifiedRegisterSource';

const isMockEnabled = (): boolean => {
  return process.env[UNIFIED_REGISTER_DATA_SOURCE_ENV.useMock] === 'true';
};

export async function createServerUnifiedRegisterSource(): Promise<IUnifiedRegisterSource> {
  if (isMockEnabled()) {
    return new MockUnifiedRegisterSource();
  }

  const config = await createAuthenticatedApiClientConfig();

  return new RestUnifiedRegisterSource(config);
}
