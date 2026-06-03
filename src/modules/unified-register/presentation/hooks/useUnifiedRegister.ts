'use client';

import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import type {
  IUnifiedRegisterItem,
  IUnifiedRegisterItems
} from '../../data/models/UnifiedRegister';

type UnifiedRegisterSearchField = keyof Pick<
  IUnifiedRegisterItem,
  'cuit' | 'businessName'
>;

interface UseUnifiedRegisterSearchParams {
  items: IUnifiedRegisterItems;
  searchFields?: readonly UnifiedRegisterSearchField[];
}

const DEFAULT_SEARCH_FIELDS: readonly UnifiedRegisterSearchField[] = [
  'cuit',
  'businessName'
];

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function matchesUnifiedRegisterSearch(
  item: IUnifiedRegisterItem,
  normalizedSearch: string,
  searchFields: readonly UnifiedRegisterSearchField[]
) {
  return searchFields.some((field) =>
    normalizeSearchValue(item[field]).includes(normalizedSearch)
  );
}

export function useUnifiedRegisterSearch({
  items,
  searchFields = DEFAULT_SEARCH_FIELDS
}: UseUnifiedRegisterSearchParams) {
  const [search, setSearch] = useState('');
  const normalizedSearch = useMemo(
    () => normalizeSearchValue(search),
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
