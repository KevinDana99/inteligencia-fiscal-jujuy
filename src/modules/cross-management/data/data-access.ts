import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config'
import type { ICrossManagementSource } from './interfaces/CrossManagementSource'
import { MockCrossManagementSource } from './sources/mock/MockCrossManagementSource'
import { RestCrossManagementSource } from './sources/rest/RestCrossManagementSource'

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_CROSS_MANAGEMENT === 'true'
}

export async function createServerCrossManagementSource(): Promise<ICrossManagementSource> {
  if (isMockEnabled()) {
    return new MockCrossManagementSource()
  }

  const config = await createAuthenticatedApiClientConfig()

  return new RestCrossManagementSource(config)
}
