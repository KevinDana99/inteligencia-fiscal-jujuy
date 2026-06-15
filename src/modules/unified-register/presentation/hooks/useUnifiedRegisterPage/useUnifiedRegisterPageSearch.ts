'use client';

import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type ChangeEvent
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

interface UseUnifiedRegisterPageSearchParams {
  items: IUnifiedRegisterItems;
  onSearchChange: () => void;
  onSearchError: (message: string) => void;
  onSearchResult: (data: IUnifiedRegisterListData) => void;
}

export function useUnifiedRegisterPageSearch({
  items,
  onSearchChange,
  onSearchError,
  onSearchResult
}: UseUnifiedRegisterPageSearchParams) {
  const [search, setSearch] = useState('');
  const [isSearchPending, startSearchTransition] = useTransition();
  const searchRequestSequence = useRef(0);

  const handlePageSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextSearch = event.currentTarget.value;
      const requestSequence = searchRequestSequence.current + 1;

      searchRequestSequence.current = requestSequence;
      setSearch(nextSearch);
      onSearchChange();

      startSearchTransition(async () => {
        const result = await getUnifiedRegisterListAction(
          1,
          UNIFIED_REGISTER_PAGE_DEFAULT_ITEMS_PER_PAGE,
          nextSearch
        );

        if (requestSequence !== searchRequestSequence.current) {
          return;
        }

        if (!result.data) {
          onSearchError(result.error ?? UNIFIED_REGISTER_LIST_ERROR_MESSAGE);
          return;
        }

        onSearchResult(result.data);
      });
    },
    [onSearchChange, onSearchError, onSearchResult]
  );

  return {
    search,
    filteredItems: items,
    handleSearchChange: handlePageSearchChange,
    hasResults: items.length > 0,
    isSearchPending
  };
}
