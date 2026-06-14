import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config'
import type { IReprocessingSource } from './interfaces/ReprocessingSource'
import { MockReprocessingSource } from './sources/mock/MockReprocessingSource'
import { RestReprocessingSource } from './sources/rest/RestReprocessingSource'

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_REPROCESSING !== 'false'
}

export async function createServerReprocessingSource(): Promise<IReprocessingSource> {
  if (isMockEnabled()) {
    return new MockReprocessingSource()
  }

  const config = await createAuthenticatedApiClientConfig()

  return new RestReprocessingSource(config)
}
