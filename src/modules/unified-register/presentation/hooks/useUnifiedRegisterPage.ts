'use client';

import { useCallback, useState, useTransition, type ChangeEvent } from 'react';
import { getUnifiedRegisterListAction } from '../../data/actions';
import type { IUnifiedRegisterListData } from '../../data/models/UnifiedRegister';
import { useUnifiedRegisterSearch } from './useUnifiedRegister';

const UNIFIED_REGISTER_PAGE_SEARCH_FIELDS = ['cuit', 'businessName'] as const;

const DEFAULT_ITEMS_PER_PAGE = 10;

export function useUnifiedRegisterPage(initialData: IUnifiedRegisterListData | null) {
  const [items, setItems] = useState(initialData?.contribuyentes ?? []);
  const { search, filteredItems, handleSearchChange, hasResults } =
    useUnifiedRegisterSearch({
      items,
      searchFields: UNIFIED_REGISTER_PAGE_SEARCH_FIELDS
    });
  const [activePage, setActivePage] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [isPagePending, startPageTransition] = useTransition();
  const [pageError, setPageError] = useState<string | null>(null);

  const handlePageSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(event);
      setActivePage(1);
    },
    [handleSearchChange]
  );

  const handlePageChange = useCallback((page: number) => {
    startPageTransition(async () => {
      const result = await getUnifiedRegisterListAction(page, DEFAULT_ITEMS_PER_PAGE);

      if (!result.data) {
        setPageError(result.error ?? 'No fue posible listar los contribuyentes.');
        return;
      }

      setItems(result.data.contribuyentes);
      setActivePage(result.data.pagina);
      setTotalPages(result.data.totalPaginas);
      setPageError(null);
    });
  }, []);

  return {
    search,
    filteredItems,
    handleSearchChange: handlePageSearchChange,
    hasResults,
    activePage,
    setActivePage: handlePageChange,
    totalPages,
    isPagePending,
    pageError
  };
}
