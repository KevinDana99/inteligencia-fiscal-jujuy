import type { ApiClientConfig } from '@/lib/api-client'
import { getServerAuthSession } from '@/lib/auth/get-server-session'
import type { IConfigurationSource } from './interfaces/ConfigurationSource'
import { RestConfigurationSource } from './sources/rest/RestConfigurationSource'

export async function createServerConfigurationSource(): Promise<IConfigurationSource> {
  const session = await getServerAuthSession()

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  }

  return new RestConfigurationSource(config)
}
