'use server';

import { revalidateServerCache } from '@/lib/server-cache';
import { createServer__ENTITY_NAME_PASCAL__Source } from '../../data-access';
import type {
  ICommandResult,
  IUpdate__ENTITY_NAME_PASCAL__Params
} from '../../models/__ENTITY_NAME_PASCAL__';
import { CACHE_TAGS } from '../../sources/rest/cache/cacheConfig';

export async function update__ENTITY_NAME_PASCAL__Action(
  params: IUpdate__ENTITY_NAME_PASCAL__Params
): Promise<ICommandResult> {
  const source = await createServer__ENTITY_NAME_PASCAL__Source();
  const result = await source.update__ENTITY_NAME_PASCAL__(params);

  if (result.success) {
    revalidateServerCache(CACHE_TAGS.__ENTITY_NAME_PASCAL__(params.id));
  }

  return result;
}
