import { cacheLife, cacheTag, revalidateTag } from 'next/cache';

export type CacheLifeProfile =
  | 'default'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'max'
  | {
      stale?: number;
      revalidate?: number;
      expire?: number;
    };

export function applyServerCache(
  life: CacheLifeProfile,
  tags: string | string[]
): void {
  cacheLife(life as never);

  const normalizedTags = Array.isArray(tags) ? tags : [tags];

  for (const tag of normalizedTags) {
    cacheTag(tag);
  }
}

export function revalidateServerCache(tags: string | string[]): void {
  const normalizedTags = Array.isArray(tags) ? tags : [tags];

  for (const tag of normalizedTags) {
    revalidateTag(tag, 'max');
  }
}
