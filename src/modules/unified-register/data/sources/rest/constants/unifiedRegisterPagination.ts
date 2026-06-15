export const UNIFIED_REGISTER_PAGINATION_QUERY_PARAMS = {
  page: 'Pagina',
  itemsPerPage: 'ItemsPagina',
  search: 'Busqueda'
} as const;

export const UNIFIED_REGISTER_DETAIL_PAGINATION_QUERY_PARAMS = {
  page: 'Pagina',
  itemsPerPage: 'ItemsPagina'
} as const;

export const UNIFIED_REGISTER_DETAIL_PAGINATION = {
  defaultPage: 1,
  defaultItemsPerPage: 20,
  maxItemsPerPage: 200
} as const;
