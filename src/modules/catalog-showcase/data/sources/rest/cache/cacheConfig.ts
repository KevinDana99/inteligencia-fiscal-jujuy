export const CACHE_TAGS = {
  CATALOG_SHOWCASE: (id: string) => `catalog-showcase-${id}`
};

export const CACHE_REVALIDATE = {
  CATALOG_SHOWCASE: 'hours' as const
};
