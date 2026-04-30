import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import type { IAdminPanelSource } from './interfaces/AdminPanelSource';
import { MockAdminPanelSource } from './sources/mock/MockAdminPanelSource';
import { RestAdminPanelSource } from './sources/rest/RestAdminPanelSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL !== 'false';
};

export async function createServerAdminPanelSource(): Promise<IAdminPanelSource> {
  if (isMockEnabled()) {
    return new MockAdminPanelSource();
  }

  const session = await getServerAuthSession();

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: session?.accessToken
  };

  return new RestAdminPanelSource(config);
}
