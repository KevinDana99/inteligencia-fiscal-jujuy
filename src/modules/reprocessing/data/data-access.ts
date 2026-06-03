import type { ApiClientConfig } from '@/lib/api-client'
import { getServerAuthSession } from '@/lib/auth/get-server-session'
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

  const session = await getServerAuthSession()

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  }

  return new RestReprocessingSource(config)
}
