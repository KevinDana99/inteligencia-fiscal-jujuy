import { createAuthenticatedApiClientConfig } from '@/lib/auth/create-authenticated-api-client-config';
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

  const config = await createAuthenticatedApiClientConfig({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      EXPLORER_REGISTER_API_BASE_URL_FALLBACK,
  });

  return new RestExplorerRegisterSource(config);
}
