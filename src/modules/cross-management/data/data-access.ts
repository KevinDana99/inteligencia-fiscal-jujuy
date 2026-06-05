import type { ApiClientConfig } from '@/lib/api-client'
import { getServerAuthSession } from '@/lib/auth/get-server-session'
import type { ICrossManagementSource } from './interfaces/CrossManagementSource'
import { MockCrossManagementSource } from './sources/mock/MockCrossManagementSource'
import { RestCrossManagementSource } from './sources/rest/RestCrossManagementSource'

const FALLBACK_API_BASE_URL = 'http://localhost:5001'

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_CROSS_MANAGEMENT === 'true'
}

export async function createServerCrossManagementSource(): Promise<ICrossManagementSource> {
  if (isMockEnabled()) {
    return new MockCrossManagementSource()
  }

  const session = await getServerAuthSession()

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? FALLBACK_API_BASE_URL,
    token: session?.accessToken
  }

  return new RestCrossManagementSource(config)
}
