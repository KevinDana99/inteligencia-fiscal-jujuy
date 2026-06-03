'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterListData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getUnifiedRegisterListAction(
  page = 1,
  itemsPerPage = 10
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listContributors(page, itemsPerPage);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los contribuyentes.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
