"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { getUnifiedRegisterMercurioAction } from "../../data/actions";
import type {
  IUnifiedRegisterFine,
  IUnifiedRegisterFinesListData,
} from "../../data/models/UnifiedRegister";
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from "../constants/unifiedRegisterDetail";
import { mapFineRecordToViewModel } from "../utils/unifiedRegisterDetailRecords";

type UseUnifiedRegisterMercurioParams = {
  contribuyenteId: string;
  initialData: IUnifiedRegisterFinesListData | null;
  initialFines: IUnifiedRegisterFine[];
  loadInitialPage?: boolean;
  waitForInitialPage?: boolean;
};

export function useUnifiedRegisterMercurio({
  contribuyenteId,
  initialData,
  initialFines,
  loadInitialPage = false,
  waitForInitialPage = false,
}: UseUnifiedRegisterMercurioParams) {
  const hasInitialData = Boolean(initialData) || initialFines.length > 0;
  const [fines, setFines] = useState(initialFines);
  const [currentPage, setCurrentPage] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [totalItems, setTotalItems] = useState(
    initialData?.totalItems ?? initialFines.length
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

  const applyListData = useCallback((data: IUnifiedRegisterFinesListData) => {
    setFines(data.multas.map(mapFineRecordToViewModel));
    setCurrentPage(data.pagina);
    setTotalPages(data.totalPaginas);
    setTotalItems(data.totalItems);
    setError(null);
    setHasLoadedInitialPage(true);
  }, []);

  const applyListError = useCallback((errorMessage: string) => {
    setFines([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalItems(0);
    setError(errorMessage);
    setHasLoadedInitialPage(true);
  }, []);

  const refreshPage = useCallback(
    async (page: number) => {
      const result = await getUnifiedRegisterMercurioAction(contribuyenteId, {
        pagina: page,
        itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE,
      });

      if (!result.data) {
        applyListError(
          result.error ?? "No fue posible listar las Pases Mercurio."
        );
        return false;
      }

      applyListData(result.data);
      return true;
    },
    [applyListData, applyListError, contribuyenteId]
  );

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
    fines,
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
    goToNextPage,
  };
}
