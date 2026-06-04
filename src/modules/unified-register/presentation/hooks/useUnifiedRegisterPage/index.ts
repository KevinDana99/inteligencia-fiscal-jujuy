'use client';

import type { IUnifiedRegisterListData } from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterPageData } from './useUnifiedRegisterPageData';
import { useUnifiedRegisterPagePagination } from './useUnifiedRegisterPagePagination';
import { useUnifiedRegisterPageSearch } from './useUnifiedRegisterPageSearch';

export function useUnifiedRegisterPage(initialData: IUnifiedRegisterListData | null) {
  const { items, setItems } = useUnifiedRegisterPageData(initialData);
  const pagination = useUnifiedRegisterPagePagination({
    initialData,
    setItems
  });
  const search = useUnifiedRegisterPageSearch({
    items,
    onSearchChange: pagination.resetActivePage
  });

  return {
    ...search,
    activePage: pagination.activePage,
    setActivePage: pagination.setActivePage,
    totalPages: pagination.totalPages,
    isPagePending: pagination.isPagePending,
    pageError: pagination.pageError
  };
}
