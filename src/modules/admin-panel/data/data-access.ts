import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { IAdminPanelSource } from './interfaces/AdminPanelSource';
import { isMockAdminPanelEnabled } from './is-mock-admin-panel-enabled';
import { MockAdminPanelSource } from './sources/mock/MockAdminPanelSource';
import { RestAdminPanelSource } from './sources/rest/RestAdminPanelSource';

export async function createServerAdminPanelSource(): Promise<IAdminPanelSource> {
  if (isMockAdminPanelEnabled()) {
    return new MockAdminPanelSource();
  }

  const session = await getServerAuthSession();

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  };

  return new RestAdminPanelSource(config);
}
