import type { ApiClientConfig } from '@/lib/api-client';
import type { IAuthSource } from './interfaces/AuthSource';
import { MockAuthSource } from './sources/mock/MockAuthSource';
import { RestAuthSource } from './sources/rest/RestAuthSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';
};

export async function createServerAuthSource(): Promise<IAuthSource> {
  if (isMockEnabled()) {
    return new MockAuthSource();
  }

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  };

  return new RestAuthSource(config);
}
