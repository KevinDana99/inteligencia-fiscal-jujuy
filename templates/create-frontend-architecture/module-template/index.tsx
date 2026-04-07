import { applyServerCache } from '@/lib/server-cache';
import withSuspense from '@/components/core/with-suspense';
import { get__ENTITY_NAME_PASCAL__Action } from './data/actions';
import { CACHE_REVALIDATE, CACHE_TAGS } from './data/sources/rest/cache/cacheConfig';
import __ENTITY_NAME_PASCAL__Card from './presentation/components/__ENTITY_NAME_PASCAL__Card';
import type { __ENTITY_NAME_PASCAL__ModuleProps } from './types';

async function __ENTITY_NAME_PASCAL__Module({
  id
}: __ENTITY_NAME_PASCAL__ModuleProps) {
  'use cache';

  applyServerCache(CACHE_REVALIDATE.__ENTITY_NAME_PASCAL__, CACHE_TAGS.__ENTITY_NAME_PASCAL__(id));

  const { data, error } = await get__ENTITY_NAME_PASCAL__Action({ id });

  if (error) {
    return <ModuleError error={new Error(error)} />;
  }

  if (!data) {
    return <ModuleError error={new Error('No data received')} />;
  }

  return <__ENTITY_NAME_PASCAL__Card id={id} entity={data} />;
}

function LoadingState() {
  return <div className="module-loading">Loading module...</div>;
}

function ModuleError({ error }: { error: Error }) {
  return <div className="module-error">Error: {error.message}</div>;
}

export default withSuspense(__ENTITY_NAME_PASCAL__Module, <LoadingState />);
