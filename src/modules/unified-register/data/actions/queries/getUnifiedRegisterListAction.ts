'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterListData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getUnifiedRegisterListAction(
  page = 1,
  itemsPerPage = 10,
  search?: string
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterListData>> {
  const payload = {
    page,
    itemsPerPage,
    search: search ?? null
  }

  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listContributors(page, itemsPerPage, search);
    const result = { data }

    console.log(
      JSON.stringify(
        {
          action: 'getUnifiedRegisterListAction',
          payload,
          result
        },
        null,
        2
      )
    )

    return result;
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los contribuyentes.'
    );

    console.log(
      JSON.stringify(
        {
          action: 'getUnifiedRegisterListAction',
          payload,
          result: {
            data: null,
            ...resolvedError
          }
        },
        null,
        2
      )
    )

    return {
      data: null,
      ...resolvedError
    };
  }
}
