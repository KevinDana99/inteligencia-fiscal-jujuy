import { ApiClientError, type ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import {
  UNIFIED_REGISTER_AUTH_ERROR,
  UNIFIED_REGISTER_DATA_SOURCE_ENV
} from './constants/unifiedRegisterDataSource';
import type { IUnifiedRegisterSource } from './interfaces/UnifiedRegisterSource';
import { MockUnifiedRegisterSource } from './sources/mock/MockUnifiedRegisterSource';
import { RestUnifiedRegisterSource } from './sources/rest/RestUnifiedRegisterSource';

const isMockEnabled = (): boolean => {
  return process.env[UNIFIED_REGISTER_DATA_SOURCE_ENV.useMock] === 'true';
};

export async function createServerUnifiedRegisterSource(): Promise<IUnifiedRegisterSource> {
  if (isMockEnabled()) {
    return new MockUnifiedRegisterSource();
  }

  const session = await getServerAuthSession();

  if (!session?.accessToken) {
    throw new ApiClientError(
      UNIFIED_REGISTER_AUTH_ERROR.status,
      UNIFIED_REGISTER_AUTH_ERROR.message,
      {
        codigo: UNIFIED_REGISTER_AUTH_ERROR.code,
        mensaje: UNIFIED_REGISTER_AUTH_ERROR.message,
        estado: UNIFIED_REGISTER_AUTH_ERROR.status
      }
    );
  }

  const config: ApiClientConfig = {
    baseUrl: process.env[UNIFIED_REGISTER_DATA_SOURCE_ENV.apiBaseUrl],
    token: session?.accessToken
  };

  return new RestUnifiedRegisterSource(config);
}
