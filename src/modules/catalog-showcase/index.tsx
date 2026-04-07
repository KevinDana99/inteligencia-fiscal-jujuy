import { applyServerCache } from '@/lib/server-cache';
import withSuspense from '@/components/core/with-suspense';
import { getCatalogShowcaseAction } from './data/actions';
import { CACHE_REVALIDATE, CACHE_TAGS } from './data/sources/rest/cache/cacheConfig';
import CatalogShowcaseCard from './presentation/components/CatalogShowcaseCard';
import type { CatalogShowcaseModuleProps } from './types';

async function CatalogShowcaseModule({ id }: CatalogShowcaseModuleProps) {
  'use cache';
  applyServerCache(CACHE_REVALIDATE.CATALOG_SHOWCASE, CACHE_TAGS.CATALOG_SHOWCASE(id));

  const { data, error } = await getCatalogShowcaseAction({ id });

  if (error) {
    return <ModuleError error={new Error(error)} />;
  }

  if (!data) {
    return <ModuleError error={new Error('No data received')} />;
  }

  return <CatalogShowcaseCard id={id} catalog={data} />;
}

function LoadingState() {
  return <div className="module-loading">Cargando catálogo...</div>;
}

function ModuleError({ error }: { error: Error }) {
  return <div className="module-error">Error: {error.message}</div>;
}

export default withSuspense(CatalogShowcaseModule, <LoadingState />);
