export const CACHE_TAGS = {
  __ENTITY_NAME_PASCAL__: (id: string) => `__CACHE_TAG_PREFIX__-${id}`
};

export const CACHE_REVALIDATE = {
  __ENTITY_NAME_PASCAL__: 'hours' as const
};
