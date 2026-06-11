'use client';

import { useMemo, useState } from 'react';
import type { IExplorerRegisterExploreData } from '../../../data/models/ExplorerRegister';

export function useExplorerRegisterSelection() {
  const [deselectedCuits, setDeselectedCuits] = useState<string[]>([]);

  function resetSelection() {
    setDeselectedCuits([]);
  }

  function deselectRow(cuit: string) {
    setDeselectedCuits((current) =>
      current.includes(cuit) ? current : [...current, cuit]
    );
  }

  function getSelectionState(data: IExplorerRegisterExploreData | null) {
    const deselectedSet = new Set(deselectedCuits);
    const visibleRows =
      data?.rows.filter((row) => !deselectedSet.has(row.cuit)) ?? [];
    const selectedCount = Math.max(
      (data?.totalItems ?? 0) - deselectedCuits.length,
      0
    );

    return {
      selectedCount,
      visibleRows
    };
  }

  const selectedCuits = useMemo(() => deselectedCuits, [deselectedCuits]);

  return {
    deselectRow,
    deselectedCuits: selectedCuits,
    getSelectionState,
    resetSelection
  };
}
