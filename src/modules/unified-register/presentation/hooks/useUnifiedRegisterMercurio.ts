'use client';

import { useState, useTransition } from 'react';
import { getUnifiedRegisterMercurioAction } from '../../data/actions';
import type {
  IUnifiedRegisterFine,
  IUnifiedRegisterFinesListData
} from '../../data/models/UnifiedRegister';
import { UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE } from '../constants/unifiedRegisterDetail';
import { mapFineRecordToViewModel } from '../utils/unifiedRegisterDetailRecords';

type UseUnifiedRegisterMercurioParams = {
  contribuyenteId: string;
  initialData: IUnifiedRegisterFinesListData | null;
  initialFines: IUnifiedRegisterFine[];
};

export function useUnifiedRegisterMercurio({
  contribuyenteId,
  initialData,
  initialFines
}: UseUnifiedRegisterMercurioParams) {
  const [fines, setFines] = useState(initialFines);
  const [currentPage, setCurrentPage] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [totalItems, setTotalItems] = useState(
    initialData?.totalItems ?? initialFines.length
  );
  const [error, setError] = useState<string | null>(null);
  const [isPagePending, startPageTransition] = useTransition();

  const applyListData = (data: IUnifiedRegisterFinesListData) => {
    setFines(data.multas.map(mapFineRecordToViewModel));
    setCurrentPage(data.pagina);
    setTotalPages(data.totalPaginas);
    setTotalItems(data.totalItems);
  };

  const refreshPage = async (page: number) => {
    const result = await getUnifiedRegisterMercurioAction(contribuyenteId, {
      pagina: page,
      itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
    });

    if (!result.data) {
      setError(result.error ?? 'No fue posible listar las multas Mercurio.');
      return false;
    }

    applyListData(result.data);
    setError(null);
    return true;
  };

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
    isPagePending,
    goToPreviousPage,
    goToNextPage
  };
}
