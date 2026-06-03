'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterInterventionOrdersListData,
  IUnifiedRegisterInterventionOrdersListParams,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getUnifiedRegisterInterventionOrdersAction(
  contribuyenteId: string,
  params?: IUnifiedRegisterInterventionOrdersListParams
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterInterventionOrdersListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listInterventionOrders(contribuyenteId, params);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar las órdenes de intervención.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
