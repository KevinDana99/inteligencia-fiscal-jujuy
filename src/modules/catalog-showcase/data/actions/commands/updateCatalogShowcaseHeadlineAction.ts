'use server';

import { revalidateServerCache } from '@/lib/server-cache';
import { createServerCatalogShowcaseSource } from '../../data-access';
import type {
  ICommandResult,
  IUpdateCatalogShowcaseParams
} from '../../models/CatalogShowcase';
import { CACHE_TAGS } from '../../sources/rest/cache/cacheConfig';

export async function updateCatalogShowcaseHeadlineAction(
  params: IUpdateCatalogShowcaseParams
): Promise<ICommandResult> {
  const source = await createServerCatalogShowcaseSource();
  const result = await source.updateCatalogShowcaseHeadline(params);

  if (result.success) {
    revalidateServerCache(CACHE_TAGS.CATALOG_SHOWCASE(params.id));
  }

  return result;
}
