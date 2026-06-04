import type { ApiClientConfig } from '@/lib/api-client';
import { isMockAuthEnabled } from '@/lib/auth/is-mock-auth-enabled';
import type { IAuthSource } from './interfaces/AuthSource';
import { MockAuthSource } from './sources/mock/MockAuthSource';
import { RestAuthSource } from './sources/rest/RestAuthSource';

export async function createServerAuthSource(): Promise<IAuthSource> {
  if (isMockAuthEnabled()) {
    return new MockAuthSource();
  }

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  };

  return new RestAuthSource(config);
}
