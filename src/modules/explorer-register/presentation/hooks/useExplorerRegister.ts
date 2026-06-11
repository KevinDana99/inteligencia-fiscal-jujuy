'use client';

import type { IExplorerRegisterCatalog } from '../../data/models/ExplorerRegister';
import {
  useExplorerRegisterCatalog,
  useExplorerRegisterForm,
  useExplorerRegisterSearch,
  useExplorerRegisterSelection
} from './explorer-register';

export function useExplorerRegister(
  initialCatalog: IExplorerRegisterCatalog | null
) {
  const catalogController = useExplorerRegisterCatalog(initialCatalog);
  const form = useExplorerRegisterForm(catalogController.catalog);
  const selection = useExplorerRegisterSelection();
  const search = useExplorerRegisterSearch({
    catalog: catalogController.catalog,
    filterValues: form.filterValues,
    onSearchSuccess: selection.resetSelection,
    selectedColumnCodes: form.selectedColumnCodes,
    temporalRange: form.temporalRange
  });
  const selectionState = selection.getSelectionState(search.data);

  function resetSearchAndSelection() {
    search.resetSearch();
    selection.resetSelection();
  }

  function toggleColumn(code: string) {
    form.toggleColumn(code);
    resetSearchAndSelection();
  }

  function updateFilterValues(code: string, values: string[]) {
    form.updateFilterValues(code, values);
    resetSearchAndSelection();
  }

  function updateTextFilterValue(code: string, value: string) {
    form.updateTextFilterValue(code, value);
    resetSearchAndSelection();
  }

  function updateSwitchFilterValue(code: string, checked: boolean) {
    form.updateSwitchFilterValue(code, checked);
    resetSearchAndSelection();
  }

  function updateTemporalRange(field: 'startDate' | 'endDate', value: string) {
    form.updateTemporalRange(field, value);
    resetSearchAndSelection();
  }

  function clearFilters() {
    form.resetForm();
    resetSearchAndSelection();
  }

  return {
    activeFilters: form.activeFilters,
    catalog: catalogController.catalog,
    changeItemsPerPage: search.changeItemsPerPage,
    changePage: search.changePage,
    clearFilters,
    columnPills: catalogController.columnPills,
    filterValues: form.filterValues,
    hasActiveTemporalFilters: form.hasActiveTemporalFilters,
    hasCatalog: catalogController.hasCatalog,
    hasSearched: search.hasSearched,
    itemsPerPage: search.itemsPerPage,
    isPending: search.isPending,
    result: search.data,
    search: search.search,
    searchError: search.error,
    searchStatus: search.status,
    selectedColumnCodes: form.selectedColumnCodes,
    selectedCount: selectionState.selectedCount,
    temporalRange: form.temporalRange,
    toggleColumn,
    updateFilterValues,
    updateSwitchFilterValue,
    updateTemporalRange,
    updateTextFilterValue,
    visibleRows: selectionState.visibleRows,
    deselectRow: selection.deselectRow
  };
}
