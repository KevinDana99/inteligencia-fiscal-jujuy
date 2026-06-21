'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterListData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

const shouldLogUnifiedRegisterListAction = process.env.NODE_ENV === 'development';

function logUnifiedRegisterListAction(event: unknown) {
  if (!shouldLogUnifiedRegisterListAction) {
    return;
  }

  console.log(JSON.stringify(event, null, 2))
}

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

    logUnifiedRegisterListAction({
      action: 'getUnifiedRegisterListAction',
      payload,
      result
    })

    return result;
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los contribuyentes.'
    );

    logUnifiedRegisterListAction({
      action: 'getUnifiedRegisterListAction',
      payload,
      result: {
        data: null,
        ...resolvedError
      }
    })

    return {
      data: null,
      ...resolvedError
    };
  }
}
