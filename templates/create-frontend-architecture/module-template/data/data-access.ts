import type { ApiClientConfig } from '@/lib/api-client';
import type { I__ENTITY_NAME_PASCAL__Source } from './interfaces/__ENTITY_NAME_PASCAL__Source';
import { Mock__ENTITY_NAME_PASCAL__Source } from './sources/mock/Mock__ENTITY_NAME_PASCAL__Source';
import { Rest__ENTITY_NAME_PASCAL__Source } from './sources/rest/Rest__ENTITY_NAME_PASCAL__Source';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK___MODULE_NAME_PASCAL__ !== 'false';
};

export async function createServer__ENTITY_NAME_PASCAL__Source(): Promise<I__ENTITY_NAME_PASCAL__Source> {
  if (isMockEnabled()) {
    return new Mock__ENTITY_NAME_PASCAL__Source();
  }

  const config: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    token: process.env.__MODULE_NAME_PASCAL___API_TOKEN
  };

  return new Rest__ENTITY_NAME_PASCAL__Source(config);
}
