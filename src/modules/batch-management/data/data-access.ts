import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
import type { IBatchManagementSource } from './interfaces/BatchManagementSource';
import { MockBatchManagementSource } from './sources/mock/MockBatchManagementSource';
import { RestBatchManagementSource } from './sources/rest/RestBatchManagementSource';

const FALLBACK_API_BASE_URL = 'http://localhost:5001';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_BATCH_MANAGEMENT === 'true';
};

export async function createServerBatchManagementSource(): Promise<IBatchManagementSource> {
  if (isMockEnabled()) {
    return new MockBatchManagementSource();
  }

  const config = await createAuthenticatedApiClientConfig({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? FALLBACK_API_BASE_URL
  });

  return new RestBatchManagementSource(config);
}
