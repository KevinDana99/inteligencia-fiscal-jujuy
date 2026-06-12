import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
import type { IAdminPanelSource } from './interfaces/AdminPanelSource';
import { isMockAdminPanelEnabled } from './is-mock-admin-panel-enabled';
import { MockAdminPanelSource } from './sources/mock/MockAdminPanelSource';
import { RestAdminPanelSource } from './sources/rest/RestAdminPanelSource';

export async function createServerAdminPanelSource(): Promise<IAdminPanelSource> {
  if (isMockAdminPanelEnabled()) {
    return new MockAdminPanelSource();
  }

  const config = await createAuthenticatedApiClientConfig();

  return new RestAdminPanelSource(config);
}
