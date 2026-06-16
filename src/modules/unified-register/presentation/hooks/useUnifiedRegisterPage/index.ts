'use client';

import { useCallback } from 'react';
import type { IUnifiedRegisterListData } from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterPageData } from './useUnifiedRegisterPageData';
import { useUnifiedRegisterPageActions } from './useUnifiedRegisterPageActions';
import { useUnifiedRegisterPagePagination } from './useUnifiedRegisterPagePagination';
import { useUnifiedRegisterPageSearch } from './useUnifiedRegisterPageSearch';

export function useUnifiedRegisterPage(initialData: IUnifiedRegisterListData | null) {
  const { items, setItems } = useUnifiedRegisterPageData(initialData);
  const actions = useUnifiedRegisterPageActions();
  const pagination = useUnifiedRegisterPagePagination({
    initialData,
    setItems
  });
  const search = useUnifiedRegisterPageSearch({
    items,
    onSearchChange: pagination.resetActivePage,
    onSearchError: pagination.setPageErrorMessage,
    onSearchResult: pagination.applyPageData
  });
  const setActivePage = useCallback(
    (page: number) => {
      pagination.setActivePage(page, search.search);
    },
    [pagination, search.search]
  );

  return {
    ...actions,
    ...search,
    activePage: pagination.activePage,
    setActivePage,
    totalPages: pagination.totalPages,
    isPagePending: pagination.isPagePending || search.isSearchPending,
    pageError: pagination.pageError
  };
}
