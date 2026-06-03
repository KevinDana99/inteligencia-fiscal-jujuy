'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import { unifiedRegisterItemsFixture } from '../../data/sources/mock/fixtures/unifiedRegisterItems';
import { useUnifiedRegisterSearch } from './useUnifiedRegister';

const UNIFIED_REGISTER_PAGE_SEARCH_FIELDS = ['cuit', 'businessName'] as const;
const UNIFIED_REGISTER_TOTAL_PAGES = 31;

export function useUnifiedRegisterPage() {
  const { search, filteredItems, handleSearchChange, hasResults } =
    useUnifiedRegisterSearch({
      items: unifiedRegisterItemsFixture,
      searchFields: UNIFIED_REGISTER_PAGE_SEARCH_FIELDS
    });
  const [activePage, setActivePage] = useState(1);

  const handlePageSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(event);
      setActivePage(1);
    },
    [handleSearchChange]
  );

  return {
    search,
    filteredItems,
    handleSearchChange: handlePageSearchChange,
    hasResults,
    activePage,
    setActivePage,
    totalPages: UNIFIED_REGISTER_TOTAL_PAGES
  };
}
