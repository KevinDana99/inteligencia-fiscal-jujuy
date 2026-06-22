'use client';

import { useMemo, useState } from 'react';
import type { IExplorerRegisterCatalog } from '../../../data/models/ExplorerRegister';
import {
  EXPLORER_REGISTER_DEFAULT_COLUMN_CODES,
  EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE
} from '../../constants';
import type {
  ExplorerRegisterFilterValues,
  IExplorerRegisterTemporalRange
} from '../../utils';
import {
  getDefaultExplorerRegisterTemporalRange,
  getDefaultExplorerRegisterColumnCodes,
  getExplorerRegisterActiveFilters
} from '../../utils';

function clearInactiveFilterValues(
  values: ExplorerRegisterFilterValues,
  catalog: IExplorerRegisterCatalog,
  selectedColumnCodes: string[]
) {
  const activeFilterCodes = new Set(
    getExplorerRegisterActiveFilters(catalog, selectedColumnCodes).map(
      (filter) => filter.code
    )
  );

  return Object.fromEntries(
    Object.entries(values).filter(([code]) => activeFilterCodes.has(code))
  );
}

export function useExplorerRegisterForm(catalog: IExplorerRegisterCatalog) {
  const defaultColumnCodes = useMemo(
    () =>
      getDefaultExplorerRegisterColumnCodes(
        catalog,
        EXPLORER_REGISTER_DEFAULT_COLUMN_CODES
      ),
    [catalog]
  );
  const [selectedColumnCodes, setSelectedColumnCodes] =
    useState<string[]>(defaultColumnCodes);
  const [filterValues, setFilterValues] =
    useState<ExplorerRegisterFilterValues>({});
  const [temporalRange, setTemporalRange] =
    useState<IExplorerRegisterTemporalRange>(
      getDefaultExplorerRegisterTemporalRange
    );

  const activeFilters = useMemo(
    () => getExplorerRegisterActiveFilters(catalog, selectedColumnCodes),
    [catalog, selectedColumnCodes]
  );
  const hasActiveTemporalFilters = activeFilters.some(
    (filter) => filter.temporal
  );

  function toggleColumn(code: string) {
    setSelectedColumnCodes((current) => {
      const nextSelectedColumnCodes = current.includes(code)
        ? current.filter((columnCode) => columnCode !== code)
        : [...current, code];

      setFilterValues((values) =>
        clearInactiveFilterValues(values, catalog, nextSelectedColumnCodes)
      );

      return nextSelectedColumnCodes;
    });
  }

  function updateFilterValues(code: string, values: string[]) {
    setFilterValues((current) => ({
      ...current,
      [code]: values
    }));
  }

  function updateTextFilterValue(code: string, value: string) {
    updateFilterValues(code, value.trim() ? [value] : []);
  }

  function updateSwitchFilterValue(code: string, checked: boolean) {
    updateFilterValues(
      code,
      checked ? [EXPLORER_REGISTER_SWITCH_ACTIVE_VALUE] : []
    );
  }

  function updateTemporalRange(
    field: keyof IExplorerRegisterTemporalRange,
    value: string
  ) {
    setTemporalRange((current) => ({
      ...current,
      [field]: value
    }));
  }

  function resetForm() {
    setSelectedColumnCodes(defaultColumnCodes);
    setFilterValues({});
    setTemporalRange(getDefaultExplorerRegisterTemporalRange());
  }

  return {
    activeFilters,
    defaultColumnCodes,
    filterValues,
    hasActiveTemporalFilters,
    resetForm,
    selectedColumnCodes,
    temporalRange,
    toggleColumn,
    updateFilterValues,
    updateSwitchFilterValue,
    updateTemporalRange,
    updateTextFilterValue
  };
}
