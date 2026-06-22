'use client';

import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent
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
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isSearchPending, startSearchTransition] = useTransition();
  const searchRequestSequence = useRef(0);

  const applySearch = useCallback(
    (nextSearch: string) => {
      const normalizedSearch = nextSearch.trim();

      if (normalizedSearch === appliedSearch) {
        return;
      }

      const requestSequence = searchRequestSequence.current + 1;

      searchRequestSequence.current = requestSequence;
      setAppliedSearch(normalizedSearch);
      onSearchChange();

      startSearchTransition(async () => {
        const result = await getUnifiedRegisterListAction(
          1,
          UNIFIED_REGISTER_PAGE_DEFAULT_ITEMS_PER_PAGE,
          normalizedSearch
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
    [appliedSearch, onSearchChange, onSearchError, onSearchResult]
  );

  const handlePageSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
    },
    []
  );

  const handlePageSearchBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      applySearch(event.currentTarget.value);
    },
    [applySearch]
  );

  const handlePageSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      applySearch(event.currentTarget.value);
    },
    [applySearch]
  );

  const handlePageSearchReset = useCallback(() => {
    setSearch('');
    applySearch('');
  }, [applySearch]);

  return {
    search,
    appliedSearch,
    filteredItems: items,
    handleSearchBlur: handlePageSearchBlur,
    handleSearchChange: handlePageSearchChange,
    handleSearchKeyDown: handlePageSearchKeyDown,
    handleSearchReset: handlePageSearchReset,
    hasResults: items.length > 0,
    isSearchPending
  };
}
