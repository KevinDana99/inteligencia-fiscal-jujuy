'use server';

import { applyServerCache } from '@/lib/server-cache';
import { createServer__ENTITY_NAME_PASCAL__Source } from '../../data-access';
import type {
  I__ENTITY_NAME_PASCAL__,
  IGet__ENTITY_NAME_PASCAL__Params,
  IModuleQueryResult
} from '../../models/__ENTITY_NAME_PASCAL__';
import {
  CACHE_REVALIDATE,
  CACHE_TAGS
} from '../../sources/rest/cache/cacheConfig';

export async function get__ENTITY_NAME_PASCAL__Action(
  params: IGet__ENTITY_NAME_PASCAL__Params
): Promise<IModuleQueryResult<I__ENTITY_NAME_PASCAL__>> {
  try {
    const data = await getCached__ENTITY_NAME_PASCAL__(params);
    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function getCached__ENTITY_NAME_PASCAL__(
  params: IGet__ENTITY_NAME_PASCAL__Params
): Promise<I__ENTITY_NAME_PASCAL__> {
  'use cache';

  applyServerCache(
    CACHE_REVALIDATE.__ENTITY_NAME_PASCAL__,
    CACHE_TAGS.__ENTITY_NAME_PASCAL__(params.id)
  );

  const source = await createServer__ENTITY_NAME_PASCAL__Source();
  return source.get__ENTITY_NAME_PASCAL__(params);
}
