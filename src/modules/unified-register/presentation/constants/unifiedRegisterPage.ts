import type { IUnifiedRegisterItem } from '../../data/models/UnifiedRegister';

export type UnifiedRegisterSearchField = keyof Pick<
  IUnifiedRegisterItem,
  'cuit' | 'businessName'
>;

export const UNIFIED_REGISTER_PAGE_SEARCH_FIELDS = [
  'cuit',
  'businessName'
] as const satisfies readonly UnifiedRegisterSearchField[];

export const UNIFIED_REGISTER_PAGE_DEFAULT_ITEMS_PER_PAGE = 10;

export const UNIFIED_REGISTER_EMPTY_SEARCH_MESSAGE =
  'No se encontraron resultados para ese CUIT o razón social';

export const UNIFIED_REGISTER_LIST_ERROR_MESSAGE =
  'No fue posible listar los contribuyentes.';

export const UNIFIED_REGISTER_SEARCH_PLACEHOLDER =
  'Buscar por CUIT o razón social...';

export const UNIFIED_REGISTER_COUNT_SINGULAR_LABEL = 'CUIT';

export const UNIFIED_REGISTER_COUNT_PLURAL_LABEL = 'CUITs';
