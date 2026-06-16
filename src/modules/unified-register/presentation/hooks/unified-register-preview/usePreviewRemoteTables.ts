'use client';

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
    hydrateMercurio: getHydrateMercurio(mercurio),
    hydrateInterventionOrders: getHydrateInterventionOrders(interventionOrdersList)
  };
}

function getHydrateMercurio(mercurio: ReturnType<typeof useUnifiedRegisterMercurio>) {
  return (data: IUnifiedRegisterFinesListData | null, error?: string | null) => {
    if (data) {
      mercurio.hydratePage(data);
      return;
    }

    mercurio.hydrateError(error ?? 'No fue posible listar las multas Mercurio.');
  };
}

function getHydrateInterventionOrders(
  orders: ReturnType<typeof useUnifiedRegisterInterventionOrders>
) {
  return (
    data: IUnifiedRegisterInterventionOrdersListData | null,
    error?: string | null
  ) => {
    if (data) {
      orders.hydratePage(data);
      return;
    }

    orders.hydrateError(
      error ?? 'No fue posible listar las órdenes de intervención.'
    );
  };
}
