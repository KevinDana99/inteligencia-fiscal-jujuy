'use client';

import {
  useCallback,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction
} from 'react';
import { getUnifiedRegisterListAction } from '../../../data/actions';
import type {
  IUnifiedRegisterItems,
  IUnifiedRegisterListData
} from '../../../data/models/UnifiedRegister';
import {
  UNIFIED_REGISTER_LIST_ERROR_MESSAGE,
  UNIFIED_REGISTER_PAGE_DEFAULT_ITEMS_PER_PAGE
} from '../../constants/unifiedRegisterPage';

interface UseUnifiedRegisterPagePaginationParams {
  initialData: IUnifiedRegisterListData | null;
  setItems: Dispatch<SetStateAction<IUnifiedRegisterItems>>;
}

export function useUnifiedRegisterPagePagination({
  initialData,
  setItems
}: UseUnifiedRegisterPagePaginationParams) {
  const [activePage, setActivePageState] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [isPagePending, startPageTransition] = useTransition();
  const [pageError, setPageError] = useState<string | null>(null);

  const applyPageData = useCallback(
    (data: IUnifiedRegisterListData) => {
      setItems(data.contribuyentes);
      setActivePageState(data.pagina);
      setTotalPages(data.totalPaginas);
      setPageError(null);
    },
    [setItems]
  );

  const setPageErrorMessage = useCallback((message: string) => {
    setPageError(message);
  }, []);

  const resetActivePage = useCallback(() => {
    setActivePageState(1);
  }, []);

  const setActivePage = useCallback(
    (page: number, search?: string) => {
      startPageTransition(async () => {
        const result = await getUnifiedRegisterListAction(
          page,
          UNIFIED_REGISTER_PAGE_DEFAULT_ITEMS_PER_PAGE,
          search
        );

        if (!result.data) {
          setPageError(result.error ?? UNIFIED_REGISTER_LIST_ERROR_MESSAGE);
          return;
        }

        applyPageData(result.data);
      });
    },
    [applyPageData]
  );

  return {
    activePage,
    setActivePage,
    resetActivePage,
    applyPageData,
    setPageErrorMessage,
    totalPages,
    isPagePending,
    pageError
  };
}
