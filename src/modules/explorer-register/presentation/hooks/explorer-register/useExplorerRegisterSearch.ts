'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { DEFAULT_EXPLORER_REGISTER_QUERY } from '../../../constants';
import { exploreExplorerRegisterAction } from '../../../data/actions';
import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload
} from '../../../data/models/ExplorerRegister';
import {
  buildExplorerRegisterPayload,
  type ExplorerRegisterFilterValues,
  type IExplorerRegisterTemporalRange
} from '../../utils';

interface UseExplorerRegisterSearchParams {
  catalog: IExplorerRegisterCatalog;
  filterValues: ExplorerRegisterFilterValues;
  onSearchSuccess: () => void;
  selectedColumnCodes: string[];
  temporalRange: IExplorerRegisterTemporalRange;
}

const SEARCH_DEBOUNCE_MS = 350;

function normalizeSearchValue(value: string) {
  return value.trim() || null;
}

export function useExplorerRegisterSearch({
  catalog,
  filterValues,
  onSearchSuccess,
  selectedColumnCodes,
  temporalRange
}: UseExplorerRegisterSearchParams) {
  const [data, setData] = useState<IExplorerRegisterExploreData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>();
  const [hasSearched, setHasSearched] = useState(false);
  const [lastPayload, setLastPayload] =
    useState<IExplorerRegisterExplorePayload | null>(null);
  const [searchValue, setSearchValueState] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(
    DEFAULT_EXPLORER_REGISTER_QUERY.itemsPerPage
  );
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  function clearPendingSearchDebounce() {
    if (!searchDebounceRef.current) {
      return;
    }

    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = null;
  }

  function buildSearchPayload({
    page,
    nextItemsPerPage = itemsPerPage,
    nextSearchValue = searchValue
  }: {
    page: number;
    nextItemsPerPage?: number;
    nextSearchValue?: string;
  }) {
    return buildExplorerRegisterPayload({
      catalog,
      filterValues,
      itemsPerPage: nextItemsPerPage,
      selectedColumnCodes,
      temporalRange,
      page,
      search: normalizeSearchValue(nextSearchValue)
    });
  }

  function applySearchResult(
    result: ReturnType<typeof buildExplorerRegisterPayload>
  ) {
    if (!result.payload) {
      setHasSearched(true);
      setError(result.error);
      setData(null);
      return;
    }

    applyPayload(result.payload);
  }

  function applyPayload(payload: IExplorerRegisterExplorePayload) {
    setError(null);
    setStatus(undefined);
    startTransition(() => {
      void (async () => {
        const result = await exploreExplorerRegisterAction(payload);

        setHasSearched(true);

        if (!result.data) {
          setError(result.error ?? 'No fue posible explorar el padron.');
          setStatus(result.status);
          setData(null);
          return;
        }

        setData(result.data);
        setLastPayload(payload);
        onSearchSuccess();
      })();
    });
  }

  function search() {
    clearPendingSearchDebounce();
    const result = buildSearchPayload({ page: 1 });

    applySearchResult(result);
  }

  function changePage(page: number) {
    clearPendingSearchDebounce();
    const payload = lastPayload
      ? {
          ...lastPayload,
          page
        }
      : buildExplorerRegisterPayload({
          catalog,
          filterValues,
          itemsPerPage,
          selectedColumnCodes,
          temporalRange,
          page,
          search: normalizeSearchValue(searchValue)
        }).payload;

    if (payload) {
      applyPayload(payload);
    }
  }

  function changeItemsPerPage(nextItemsPerPage: number) {
    clearPendingSearchDebounce();
    setItemsPerPage(nextItemsPerPage);

    const payload = lastPayload
      ? {
          ...lastPayload,
          page: 1,
          itemsPerPage: nextItemsPerPage
        }
      : buildExplorerRegisterPayload({
          catalog,
          filterValues,
          itemsPerPage: nextItemsPerPage,
          selectedColumnCodes,
          temporalRange,
          page: 1,
          search: normalizeSearchValue(searchValue)
        }).payload;

    if (payload) {
      applyPayload(payload);
    }
  }

  function setSearchValue(nextSearchValue: string) {
    setSearchValueState(nextSearchValue);

    if (!hasSearched) {
      return;
    }

    clearPendingSearchDebounce();
    searchDebounceRef.current = setTimeout(() => {
      const result = buildSearchPayload({
        page: 1,
        nextSearchValue
      });

      applySearchResult(result);
      searchDebounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  }

  function resetSearch() {
    clearPendingSearchDebounce();
    setData(null);
    setError(null);
    setStatus(undefined);
    setHasSearched(false);
    setLastPayload(null);
    setSearchValueState('');
  }

  useEffect(
    () => () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    },
    []
  );

  return {
    changeItemsPerPage,
    changePage,
    data,
    error,
    hasSearched,
    itemsPerPage,
    isPending,
    resetSearch,
    search,
    searchValue,
    setSearchValue,
    status
  };
}
