'use server';

import { applyServerCache } from '@/lib/server-cache';
import { createServerCatalogShowcaseSource } from '../../data-access';
import type {
  ICatalogShowcase,
  IGetCatalogShowcaseParams,
  IModuleQueryResult
} from '../../models/CatalogShowcase';
import {
  CACHE_REVALIDATE,
  CACHE_TAGS
} from '../../sources/rest/cache/cacheConfig';

export async function getCatalogShowcaseAction(
  params: IGetCatalogShowcaseParams
): Promise<IModuleQueryResult<ICatalogShowcase>> {
  try {
    const data = await getCachedCatalogShowcase(params);
    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function getCachedCatalogShowcase(
  params: IGetCatalogShowcaseParams
): Promise<ICatalogShowcase> {
  'use cache';

  applyServerCache(
    CACHE_REVALIDATE.CATALOG_SHOWCASE,
    CACHE_TAGS.CATALOG_SHOWCASE(params.id)
  );

  const source = await createServerCatalogShowcaseSource();
  return source.getCatalogShowcase(params);
}
