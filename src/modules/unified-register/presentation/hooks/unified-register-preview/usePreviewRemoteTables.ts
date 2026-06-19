'use client';

import { useCallback } from 'react';
import type {
  IUnifiedRegisterDetail,
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterInterventionOrdersListData
} from '../../../data/models/UnifiedRegister';
import { useUnifiedRegisterInterventionOrders } from '../useUnifiedRegisterInterventionOrders';
import { useUnifiedRegisterMercurio } from '../useUnifiedRegisterMercurio';

type UsePreviewRemoteTablesParams = {
  item: IUnifiedRegisterDetail;
  initialMercurioData: IUnifiedRegisterFinesListData | null;
  initialInterventionOrdersData: IUnifiedRegisterInterventionOrdersListData | null;
  waitForMercurio: boolean;
  waitForInterventionOrders: boolean;
};

export function usePreviewRemoteTables({
  item,
  initialMercurioData,
  initialInterventionOrdersData,
  waitForMercurio,
  waitForInterventionOrders
}: UsePreviewRemoteTablesParams) {
  const mercurio = useUnifiedRegisterMercurio({
    contribuyenteId: item.contribuyenteId,
    initialData: initialMercurioData,
    initialFines: item.fines,
    waitForInitialPage: waitForMercurio
  });
  const interventionOrdersList = useUnifiedRegisterInterventionOrders({
    contribuyenteId: item.contribuyenteId,
    initialData: initialInterventionOrdersData,
    initialInterventionOrders: item.interventionOrders,
    waitForInitialPage: waitForInterventionOrders
  });
  const {
    hydratePage: hydrateMercurioPage,
    hydrateError: hydrateMercurioError
  } = mercurio;
  const {
    hydratePage: hydrateInterventionOrdersPage,
    hydrateError: hydrateInterventionOrdersError
  } = interventionOrdersList;
  const hydrateMercurio = useCallback((
    data: IUnifiedRegisterFinesListData | null,
    error?: string | null
  ) => {
    if (data) {
      hydrateMercurioPage(data);
      return;
    }

    hydrateMercurioError(error ?? 'No fue posible listar las multas Mercurio.');
  }, [hydrateMercurioError, hydrateMercurioPage]);
  const hydrateInterventionOrders = useCallback((
    data: IUnifiedRegisterInterventionOrdersListData | null,
    error?: string | null
  ) => {
    if (data) {
      hydrateInterventionOrdersPage(data);
      return;
    }

    hydrateInterventionOrdersError(
      error ?? 'No fue posible listar las órdenes de intervención.'
    );
  }, [hydrateInterventionOrdersError, hydrateInterventionOrdersPage]);

  return {
    fines: mercurio.fines,
    finesCurrentPage: mercurio.currentPage,
    finesTotalPages: mercurio.totalPages,
    finesTotalItems: mercurio.totalItems,
    fineActionError: mercurio.error,
    isFinesPagePending: mercurio.isPagePending,
    goToPreviousFinePage: mercurio.goToPreviousPage,
    goToNextFinePage: mercurio.goToNextPage,
    interventionOrders: interventionOrdersList.interventionOrders,
    interventionOrdersCurrentPage: interventionOrdersList.currentPage,
    interventionOrdersTotalPages: interventionOrdersList.totalPages,
    interventionOrdersTotalItems: interventionOrdersList.totalItems,
    interventionOrdersError: interventionOrdersList.error,
    isInterventionOrdersPagePending: interventionOrdersList.isPagePending,
    goToPreviousInterventionOrderPage: interventionOrdersList.goToPreviousPage,
    goToNextInterventionOrderPage: interventionOrdersList.goToNextPage,
    hydrateMercurio,
    hydrateInterventionOrders
  };
}
