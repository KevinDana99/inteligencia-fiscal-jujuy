import { ApiClientError, type ApiClientConfig } from '@/lib/api-client';
import { getServerAuthSession } from '@/lib/auth/get-server-session';
import {
  DOCUMENTS_AUTH_ERROR,
  DOCUMENTS_DATA_SOURCE_ENV,
  resolveDocumentsApiBaseUrl
} from './constants/documentsDataSource';
import type { IDocumentsSource } from './interfaces/DocumentsSource';
import { MockDocumentsSource } from './sources/mock/MockDocumentsSource';
import { RestDocumentsSource } from './sources/rest/RestDocumentsSource';

const isMockEnabled = (): boolean => {
  return process.env[DOCUMENTS_DATA_SOURCE_ENV.useMock] === 'true';
};

export async function createServerDocumentsSource(): Promise<IDocumentsSource> {
  if (isMockEnabled()) {
    return new MockDocumentsSource();
  }

  const session = await getServerAuthSession();

  if (!session?.accessToken) {
    throw new ApiClientError(
      DOCUMENTS_AUTH_ERROR.status,
      DOCUMENTS_AUTH_ERROR.message,
      {
        codigo: DOCUMENTS_AUTH_ERROR.code,
        mensaje: DOCUMENTS_AUTH_ERROR.message,
        estado: DOCUMENTS_AUTH_ERROR.status
      }
    );
  }

  const config: ApiClientConfig = {
    baseUrl: resolveDocumentsApiBaseUrl(),
    token: session.accessToken,
    refreshAccessToken: async () => {
      const refreshedSession = await getServerAuthSession({ forceRefresh: true });
      return refreshedSession?.accessToken ?? null;
    }
  };

  return new RestDocumentsSource(config);
}
