'use client';

import { useMemo, useState } from 'react';
import type { IExplorerRegisterRow } from '../../../data/models/ExplorerRegister';
import { filterExplorerRegisterRowsByLocalSearch } from '../../utils';

export function useExplorerRegisterLocalFilter(rows: IExplorerRegisterRow[]) {
  const [searchValue, setSearchValue] = useState('');
  const filteredRows = useMemo(
    () => filterExplorerRegisterRowsByLocalSearch(rows, searchValue),
    [rows, searchValue]
  );

  function resetLocalSearch() {
    setSearchValue('');
  }

  return {
    filteredRows,
    resetLocalSearch,
    searchValue,
    setSearchValue
  };
}
