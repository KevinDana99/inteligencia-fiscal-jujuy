'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterHeaderRecord,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getUnifiedRegisterHeaderAction(
  contribuyenteId: string
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterHeaderRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.getContributorHeader(contribuyenteId);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible cargar la cabecera del contribuyente.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
