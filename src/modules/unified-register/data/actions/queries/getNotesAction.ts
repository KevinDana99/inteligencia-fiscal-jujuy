'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterNotesListData,
  IUnifiedRegisterNotesListParams,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getNotesAction(
  contribuyenteId: string,
  params?: IUnifiedRegisterNotesListParams
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterNotesListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listNotes(contribuyenteId, params);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar las notas.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
