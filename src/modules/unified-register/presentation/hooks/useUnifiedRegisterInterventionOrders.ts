'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { getUnifiedRegisterInterventionOrdersAction } from '../../data/actions';
import type {
  IUnifiedRegisterInterventionOrder,
  IUnifiedRegisterInterventionOrdersListData
} from '../../data/models/UnifiedRegister';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '../constants/unifiedRegisterDetail';
import { mapInterventionOrderRecordToViewModel } from '../utils/unifiedRegisterDetailRecords';

type UseUnifiedRegisterInterventionOrdersParams = {
  contribuyenteId: string;
  initialData: IUnifiedRegisterInterventionOrdersListData | null;
  initialInterventionOrders: IUnifiedRegisterInterventionOrder[];
  loadInitialPage?: boolean;
  waitForInitialPage?: boolean;
};

export function useUnifiedRegisterInterventionOrders({
  contribuyenteId,
  initialData,
  initialInterventionOrders,
  loadInitialPage = false,
  waitForInitialPage = false
}: UseUnifiedRegisterInterventionOrdersParams) {
  const hasInitialData =
    Boolean(initialData) || initialInterventionOrders.length > 0;
  const [interventionOrders, setInterventionOrders] = useState(
    initialInterventionOrders
  );
  const [currentPage, setCurrentPage] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [totalItems, setTotalItems] = useState(
    initialData?.totalItems ?? initialInterventionOrders.length
  );
  const [error, setError] = useState<string | null>(null);
  const requestedInitialContributorIdRef = useRef<string | null>(
    hasInitialData ? contribuyenteId : null
  );
  const [hasLoadedInitialPage, setHasLoadedInitialPage] = useState(
    (!loadInitialPage && !waitForInitialPage) || hasInitialData
  );
  const [isInitialPagePending, startInitialPageTransition] = useTransition();
  const [isPaginationPending, startPageTransition] = useTransition();

  const applyListData = useCallback((
    data: IUnifiedRegisterInterventionOrdersListData
  ) => {
    setInterventionOrders(data.ordenes.map(mapInterventionOrderRecordToViewModel));
    setCurrentPage(data.pagina);
    setTotalPages(data.totalPaginas);
    setTotalItems(data.totalItems);
    setError(null);
    setHasLoadedInitialPage(true);
  }, []);

  const applyListError = useCallback((errorMessage: string) => {
    setInterventionOrders([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalItems(0);
    setError(errorMessage);
    setHasLoadedInitialPage(true);
  }, []);

  const refreshPage = useCallback(async (page: number) => {
    const result = await getUnifiedRegisterInterventionOrdersAction(
      contribuyenteId,
      {
        pagina: page,
        itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
      }
    );

    if (!result.data) {
      applyListError(
        result.error ?? 'No fue posible listar las órdenes de intervención.'
      );
      return false;
    }

    applyListData(result.data);
    return true;
  }, [applyListData, applyListError, contribuyenteId]);

  useEffect(() => {
    if (
      !loadInitialPage ||
      requestedInitialContributorIdRef.current === contribuyenteId
    ) {
      return;
    }

    requestedInitialContributorIdRef.current = contribuyenteId;
    startInitialPageTransition(async () => {
      try {
        await refreshPage(1);
      } finally {
        setHasLoadedInitialPage(true);
      }
    });
  }, [contribuyenteId, loadInitialPage, refreshPage]);

  const goToPreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }

    startPageTransition(async () => {
      await refreshPage(currentPage - 1);
    });
  };

  const goToNextPage = () => {
    if (currentPage >= totalPages) {
      return;
    }

    startPageTransition(async () => {
      await refreshPage(currentPage + 1);
    });
  };

  return {
    interventionOrders,
    currentPage,
    totalPages,
    totalItems,
    error,
    isPagePending:
      ((loadInitialPage || waitForInitialPage) && !hasLoadedInitialPage) ||
      isInitialPagePending ||
      isPaginationPending,
    hydratePage: applyListData,
    hydrateError: applyListError,
    goToPreviousPage,
    goToNextPage
  };
}
