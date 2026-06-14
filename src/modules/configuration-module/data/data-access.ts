import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config'
import type { IConfigurationSource } from './interfaces/ConfigurationSource'
import { RestConfigurationSource } from './sources/rest/RestConfigurationSource'

export async function createServerConfigurationSource(): Promise<IConfigurationSource> {
  const config = await createAuthenticatedApiClientConfig()

  return new RestConfigurationSource(config)
}
