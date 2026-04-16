import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { ICatalogShowcaseSource } from './interfaces/CatalogShowcaseSource';
import { MockCatalogShowcaseSource } from './sources/mock/MockCatalogShowcaseSource';
import { RestCatalogShowcaseSource } from './sources/rest/RestCatalogShowcaseSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE !== 'false';
};

export async function createServerCatalogShowcaseSource(): Promise<ICatalogShowcaseSource> {
  if (isMockEnabled()) {
    return new MockCatalogShowcaseSource();
  }

  const session = await getServerAuthSession();

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken ?? process.env.CATALOG_SHOWCASE_API_TOKEN
  };

  return new RestCatalogShowcaseSource(config);
}
