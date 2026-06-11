'use client';

import { useState, useTransition } from 'react';
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
  const [itemsPerPage, setItemsPerPage] = useState(
    DEFAULT_EXPLORER_REGISTER_QUERY.itemsPerPage
  );
  const [isPending, startTransition] = useTransition();

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
    const result = buildExplorerRegisterPayload({
      catalog,
      filterValues,
      itemsPerPage,
      selectedColumnCodes,
      temporalRange,
      page: 1
    });

    if (!result.payload) {
      setHasSearched(true);
      setError(result.error);
      setData(null);
      return;
    }

    applyPayload(result.payload);
  }

  function changePage(page: number) {
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
          page
        }).payload;

    if (payload) {
      applyPayload(payload);
    }
  }

  function changeItemsPerPage(nextItemsPerPage: number) {
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
          page: 1
        }).payload;

    if (payload) {
      applyPayload(payload);
    }
  }

  function resetSearch() {
    setData(null);
    setError(null);
    setStatus(undefined);
    setHasSearched(false);
    setLastPayload(null);
  }

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
    status
  };
}
