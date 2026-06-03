'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterContactsListData,
  IUnifiedRegisterContactsListParams,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getContactsAction(
  contribuyenteId: string,
  params?: IUnifiedRegisterContactsListParams
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterContactsListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listContacts(contribuyenteId, params);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los contactos.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
