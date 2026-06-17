import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
import type { IUnifiedRegisterSource } from './interfaces/UnifiedRegisterSource';
import { isMockUnifiedRegisterEnabled } from './is-mock-unified-register-enabled';
import { MockUnifiedRegisterSource } from './sources/mock/MockUnifiedRegisterSource';
import { RestUnifiedRegisterSource } from './sources/rest/RestUnifiedRegisterSource';

export async function createServerUnifiedRegisterSource(): Promise<IUnifiedRegisterSource> {
  if (isMockUnifiedRegisterEnabled()) {
    return new MockUnifiedRegisterSource();
  }

  const config = await createAuthenticatedApiClientConfig();

  return new RestUnifiedRegisterSource(config);
}
