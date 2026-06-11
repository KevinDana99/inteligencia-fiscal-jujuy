import {
  DEFAULT_EXPLORER_REGISTER_QUERY,
  EXPLORER_REGISTER_REQUEST_LIMITS
} from '../../constants';
import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterExploreFilter,
  IExplorerRegisterExplorePayload,
  IExplorerRegisterFilter
} from '../../data/models/ExplorerRegister';
import { EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE } from '../constants';
import type { IExplorerRegisterTemporalRange } from './dateExplorerRegisterRange';
import { validateExplorerRegisterTemporalRange } from './dateExplorerRegisterRange';

export type ExplorerRegisterFilterValues = Record<string, string[]>;

export interface IBuildExplorerRegisterPayloadParams {
  catalog: IExplorerRegisterCatalog;
  selectedColumnCodes: string[];
  filterValues: ExplorerRegisterFilterValues;
  temporalRange: IExplorerRegisterTemporalRange;
  page?: number;
  itemsPerPage?: number;
}

export interface IBuildExplorerRegisterPayloadResult {
  payload: IExplorerRegisterExplorePayload | null;
  error: string | null;
}

function uniqTrimmedValues(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) =>
          value.slice(0, EXPLORER_REGISTER_REQUEST_LIMITS.maxFilterValueLength)
        )
    )
  ).slice(0, EXPLORER_REGISTER_REQUEST_LIMITS.maxFilterValues);
}

function shouldSendFilter(filter: IExplorerRegisterFilter, values: string[]) {
  if (filter.inputType === 'switch') {
    return values.includes(EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE);
  }

  return values.length > 0;
}

function buildFilters(
  activeFilters: IExplorerRegisterFilter[],
  filterValues: ExplorerRegisterFilterValues
) {
  return activeFilters
    .map<IExplorerRegisterExploreFilter | null>((filter) => {
      const values = uniqTrimmedValues(filterValues[filter.code] ?? []);

      if (!shouldSendFilter(filter, values)) {
        return null;
      }

      return {
        code: filter.code,
        values:
          filter.inputType === 'switch'
            ? [EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE]
            : values
      };
    })
    .filter((filter): filter is IExplorerRegisterExploreFilter =>
      Boolean(filter)
    )
    .slice(0, EXPLORER_REGISTER_REQUEST_LIMITS.maxFilters);
}

export function getDefaultExplorerRegisterColumnCodes(
  catalog: IExplorerRegisterCatalog,
  defaultColumnCodes: readonly string[]
) {
  const availableCodes = new Set(
    catalog.availableColumns.map((column) => column.code)
  );

  return defaultColumnCodes.filter((code) => availableCodes.has(code));
}

export function getExplorerRegisterActiveFilters(
  catalog: IExplorerRegisterCatalog,
  selectedColumnCodes: string[]
) {
  const selectedCodes = new Set(selectedColumnCodes);

  return catalog.filters.filter((filter) => {
    if (selectedCodes.has(filter.code)) {
      return true;
    }

    return filter.relatedColumns.some((columnCode) =>
      selectedCodes.has(columnCode)
    );
  });
}

export function buildExplorerRegisterPayload({
  catalog,
  selectedColumnCodes,
  filterValues,
  temporalRange,
  page = DEFAULT_EXPLORER_REGISTER_QUERY.page,
  itemsPerPage = DEFAULT_EXPLORER_REGISTER_QUERY.itemsPerPage
}: IBuildExplorerRegisterPayloadParams): IBuildExplorerRegisterPayloadResult {
  const availableColumnCodes = new Set(
    catalog.availableColumns.map((column) => column.code)
  );
  const activeFilters = getExplorerRegisterActiveFilters(
    catalog,
    selectedColumnCodes
  );
  const usesTemporalFilters = activeFilters.some((filter) => filter.temporal);
  const temporalError = validateExplorerRegisterTemporalRange(
    temporalRange,
    usesTemporalFilters && (Boolean(temporalRange.startDate) || Boolean(temporalRange.endDate))
  );

  if (temporalError) {
    return {
      payload: null,
      error: temporalError
    };
  }

  const columns = Array.from(
    new Set(selectedColumnCodes.filter((code) => availableColumnCodes.has(code)))
  );
  const filters = buildFilters(activeFilters, filterValues);

  return {
    error: null,
    payload: {
      page: Math.min(
        Math.max(page, EXPLORER_REGISTER_REQUEST_LIMITS.minPage),
        EXPLORER_REGISTER_REQUEST_LIMITS.maxPage
      ),
      itemsPerPage: Math.min(
        Math.max(
          itemsPerPage,
          EXPLORER_REGISTER_REQUEST_LIMITS.minItemsPerPage
        ),
        EXPLORER_REGISTER_REQUEST_LIMITS.maxItemsPerPage
      ),
      columns,
      filters,
      ...(temporalRange.startDate && temporalRange.endDate
        ? {
            startDate: temporalRange.startDate,
            endDate: temporalRange.endDate
          }
        : {})
    }
  };
}
