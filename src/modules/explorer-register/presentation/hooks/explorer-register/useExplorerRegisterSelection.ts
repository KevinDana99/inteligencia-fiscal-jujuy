'use client';

import { useMemo, useState } from 'react';
import type {
  IExplorerRegisterExploreData,
  IExplorerRegisterRow
} from '../../../data/models/ExplorerRegister';

export function useExplorerRegisterSelection() {
  const [deselectedCuits, setDeselectedCuits] = useState<string[]>([]);

  function resetSelection() {
    setDeselectedCuits([]);
  }

  function setRowSelected(cuit: string, selected: boolean) {
    setDeselectedCuits((current) => {
      if (selected) {
        return current.filter((currentCuit) => currentCuit !== cuit);
      }

      return current.includes(cuit) ? current : [...current, cuit];
    });
  }

  function setRowsSelected(cuits: string[], selected: boolean) {
    setDeselectedCuits((current) => {
      const nextDeselectedCuits = new Set(current);

      cuits.forEach((cuit) => {
        if (selected) {
          nextDeselectedCuits.delete(cuit);
          return;
        }

        nextDeselectedCuits.add(cuit);
      });

      return Array.from(nextDeselectedCuits);
    });
  }

  function getSelectionState(
    data: IExplorerRegisterExploreData | null,
    visibleRows: IExplorerRegisterRow[]
  ) {
    const deselectedSet = new Set(deselectedCuits);
    const rows = data?.rows ?? [];
    const selectedRows = rows.filter((row) => !deselectedSet.has(row.cuit));
    const selectedVisibleRows = visibleRows.filter(
      (row) => !deselectedSet.has(row.cuit)
    );

    return {
      allVisibleRowsSelected:
        visibleRows.length > 0 &&
        selectedVisibleRows.length === visibleRows.length,
      isRowSelected: (cuit: string) => !deselectedSet.has(cuit),
      selectedCount: selectedRows.length,
      selectedRows,
      someVisibleRowsSelected:
        selectedVisibleRows.length > 0 &&
        selectedVisibleRows.length < visibleRows.length,
      visibleRows
    };
  }

  const selectedCuits = useMemo(() => deselectedCuits, [deselectedCuits]);

  return {
    deselectedCuits: selectedCuits,
    getSelectionState,
    resetSelection,
    setRowsSelected,
    setRowSelected
  };
}
