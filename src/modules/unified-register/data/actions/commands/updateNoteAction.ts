'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterCommandResult,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function updateNoteAction(
  contribuyenteId: string,
  notaId: string,
  payload: IUnifiedRegisterNoteInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterNoteRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.updateNote(contribuyenteId, notaId, payload);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible editar la nota.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
