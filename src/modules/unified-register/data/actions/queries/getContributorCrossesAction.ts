'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterContributorCrossesData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getContributorCrossesAction(
  contribuyenteId: string
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterContributorCrossesData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listContributorCrosses(contribuyenteId);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los cruces del contribuyente.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
