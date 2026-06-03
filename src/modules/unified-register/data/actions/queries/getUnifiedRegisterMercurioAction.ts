'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterFinesListData,
  IUnifiedRegisterFinesListParams,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getUnifiedRegisterMercurioAction(
  contribuyenteId: string,
  params?: IUnifiedRegisterFinesListParams
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterFinesListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listMercurioFines(contribuyenteId, params);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar las multas Mercurio.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
