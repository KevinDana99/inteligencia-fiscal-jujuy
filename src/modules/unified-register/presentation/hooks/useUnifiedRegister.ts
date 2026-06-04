'use client';

import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import type { IUnifiedRegisterItems } from '../../data/models/UnifiedRegister';
import type { UnifiedRegisterSearchField } from '../constants/unifiedRegisterPage';
import {
  matchesUnifiedRegisterSearch,
  normalizeUnifiedRegisterSearchValue
} from '../utils/unifiedRegisterSearch';

interface UseUnifiedRegisterSearchParams {
  items: IUnifiedRegisterItems;
  searchFields?: readonly UnifiedRegisterSearchField[];
}

const DEFAULT_SEARCH_FIELDS: readonly UnifiedRegisterSearchField[] = [
  'cuit',
  'businessName'
];

export function useUnifiedRegisterSearch({
  items,
  searchFields = DEFAULT_SEARCH_FIELDS
}: UseUnifiedRegisterSearchParams) {
  const [search, setSearch] = useState('');
  const normalizedSearch = useMemo(
    () => normalizeUnifiedRegisterSearchValue(search),
    [search]
  );

  const filteredItems = useMemo(() => {
    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) =>
      matchesUnifiedRegisterSearch(item, normalizedSearch, searchFields)
    );
  }, [items, normalizedSearch, searchFields]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
    },
    []
  );

  return {
    search,
    setSearch,
    filteredItems,
    handleSearchChange,
    hasResults: filteredItems.length > 0,
    isSearching: normalizedSearch.length > 0
  };
}
