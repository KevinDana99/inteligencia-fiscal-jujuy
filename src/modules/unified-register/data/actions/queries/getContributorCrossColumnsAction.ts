'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterContributorCrossColumnsData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

interface GetContributorCrossColumnsActionParams {
  contribuyenteId: string;
  cruceId: string;
}

export async function getContributorCrossColumnsAction({
  contribuyenteId,
  cruceId
}: GetContributorCrossColumnsActionParams): Promise<
  IUnifiedRegisterQueryResult<IUnifiedRegisterContributorCrossColumnsData>
> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.getContributorCrossColumns(contribuyenteId, cruceId);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible obtener las columnas del cruce.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
