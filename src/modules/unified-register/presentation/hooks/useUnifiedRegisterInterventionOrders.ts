'use client';

import { useState, useTransition } from 'react';
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
};

export function useUnifiedRegisterInterventionOrders({
  contribuyenteId,
  initialData,
  initialInterventionOrders
}: UseUnifiedRegisterInterventionOrdersParams) {
  const [interventionOrders, setInterventionOrders] = useState(
    initialInterventionOrders
  );
  const [currentPage, setCurrentPage] = useState(initialData?.pagina ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPaginas ?? 0);
  const [totalItems, setTotalItems] = useState(
    initialData?.totalItems ?? initialInterventionOrders.length
  );
  const [error, setError] = useState<string | null>(null);
  const [isPagePending, startPageTransition] = useTransition();

  const applyListData = (data: IUnifiedRegisterInterventionOrdersListData) => {
    setInterventionOrders(data.ordenes.map(mapInterventionOrderRecordToViewModel));
    setCurrentPage(data.pagina);
    setTotalPages(data.totalPaginas);
    setTotalItems(data.totalItems);
  };

  const refreshPage = async (page: number) => {
    const result = await getUnifiedRegisterInterventionOrdersAction(
      contribuyenteId,
      {
        pagina: page,
        itemsPagina: UNIFIED_REGISTER_DETAIL_TABLE_ITEMS_PER_PAGE
      }
    );

    if (!result.data) {
      setError(result.error ?? 'No fue posible listar las órdenes de intervención.');
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
    interventionOrders,
    currentPage,
    totalPages,
    totalItems,
    error,
    isPagePending,
    goToPreviousPage,
    goToNextPage
  };
}
