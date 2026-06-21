export const EXPLORER_REGISTER_DEFAULT_COLUMN_CODES = [] as const;

export const EXPLORER_REGISTER_ITEMS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

export const EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE = 'SI';
export const EXPLORER_REGISTER_SWITCH_INACTIVE_VALUE = 'NO';

export const EMPTY_EXPLORER_REGISTER_CATALOG: IExplorerRegisterCatalog = {
  fixedColumns: [],
  availableColumns: [],
  filters: []
};

export const EXPLORER_REGISTER_TEXTS = {
  navbarAction: 'Crear lote con',
  navbarActionSuffix: 'resultados',
  columnsTitle: 'Columnas y filtros disponibles',
  filtersTitle: 'Configurar filtros',
  clearFilters: 'Limpiar filtros',
  clearFilter: 'Limpiar',
  search: 'Buscar',
  filterSearchPlaceholder: 'Buscar más...',
  switchOn: 'Sí',
  switchOff: 'No',
  allOptions: 'Todas las opciones',
  temporalPeriod: 'Período de búsqueda',
  temporalStart: 'Fecha inicio',
  temporalEnd: 'Fecha fin',
  pageSize: 'Filas por pagina',
  totalResults: 'Total',
  sourceUnavailable:
    'La fuente padronal no esta disponible o no fue preparada todavia.',
  initialFallback:
    'Selecciona columnas/filtros arriba y presiona Buscar para poblar el cuadro.',
  emptyFallback: 'No se encontro coincidencias para la busqueda realizada',
  catalogFallback:
    'No fue posible cargar el catalogo de filtros para Explorar Padron.',
  temporalRangeRequired:
    'Para usar filtros temporales, completa fecha inicio y fecha fin.',
  temporalRangeOrder:
    'La fecha inicio no puede ser posterior a la fecha fin.',
  temporalRangeLimit: 'El rango temporal no puede superar 36 meses.'
} as const;
import type { IExplorerRegisterCatalog } from '../../data/models/ExplorerRegister';
