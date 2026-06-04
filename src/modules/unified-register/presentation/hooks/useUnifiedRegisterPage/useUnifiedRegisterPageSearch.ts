'use client';

import { useCallback, type ChangeEvent } from 'react';
import type { IUnifiedRegisterItems } from '../../../data/models/UnifiedRegister';
import { UNIFIED_REGISTER_PAGE_SEARCH_FIELDS } from '../../constants/unifiedRegisterPage';
import { useUnifiedRegisterSearch } from '../useUnifiedRegister';

interface UseUnifiedRegisterPageSearchParams {
  items: IUnifiedRegisterItems;
  onSearchChange: () => void;
}

export function useUnifiedRegisterPageSearch({
  items,
  onSearchChange
}: UseUnifiedRegisterPageSearchParams) {
  const { search, filteredItems, handleSearchChange, hasResults } =
    useUnifiedRegisterSearch({
      items,
      searchFields: UNIFIED_REGISTER_PAGE_SEARCH_FIELDS
    });

  const handlePageSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(event);
      onSearchChange();
    },
    [handleSearchChange, onSearchChange]
  );

  return {
    search,
    filteredItems,
    handleSearchChange: handlePageSearchChange,
    hasResults
  };
}
