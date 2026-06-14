import type { IExplorerRegisterExplorePayload } from '../data/models/ExplorerRegister';

export const EXPLORER_REGISTER_API_ENDPOINTS = {
  catalog:
    '/api/procesos-informacion/padron/exploraciones/catalogo-filtros',
  explore: '/api/procesos-informacion/padron/exploraciones'
} as const;

export const EXPLORER_REGISTER_REQUEST_LIMITS = {
  minPage: 1,
  maxPage: 10000,
  minItemsPerPage: 1,
  maxItemsPerPage: 200,
  maxFilters: 22,
  maxFilterValues: 100,
  maxFilterValueLength: 100,
  maxTemporalRangeMonths: 36
} as const;

export const DEFAULT_EXPLORER_REGISTER_QUERY: Pick<
  IExplorerRegisterExplorePayload,
  'page' | 'itemsPerPage' | 'columns' | 'filters'
> = {
  page: 1,
  itemsPerPage: 20,
  columns: [],
  filters: []
};
