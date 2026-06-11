import type { ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import {
  EXPLORER_REGISTER_API_BASE_URL_FALLBACK
} from '../constants';
import type { IExplorerRegisterSource } from './interfaces/ExplorerRegisterSource';
import { MockExplorerRegisterSource } from './sources/mock/MockExplorerRegisterSource';
import { RestExplorerRegisterSource } from './sources/rest/RestExplorerRegisterSource';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_EXPLORER_REGISTER === 'true';
};

export async function createServerExplorerRegisterSource(): Promise<IExplorerRegisterSource> {
  if (isMockEnabled()) {
    return new MockExplorerRegisterSource();
  }

  const session = await getServerAuthSession();
  const config: ApiClientConfig = {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      EXPLORER_REGISTER_API_BASE_URL_FALLBACK,
    token: session?.accessToken
  };

  return new RestExplorerRegisterSource(config);
}
