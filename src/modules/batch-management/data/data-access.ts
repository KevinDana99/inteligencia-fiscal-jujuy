import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { IBatchManagementSource } from './interfaces/BatchManagementSource';
import { MockBatchManagementSource } from './sources/mock/MockBatchManagementSource';
import { RestBatchManagementSource } from './sources/rest/RestBatchManagementSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_BATCH_MANAGEMENT !== 'false';
};

export async function createServerBatchManagementSource(): Promise<IBatchManagementSource> {
  if (isMockEnabled()) {
    return new MockBatchManagementSource();
  }

  const session = await getServerAuthSession();
  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  };

  return new RestBatchManagementSource(config);
}
