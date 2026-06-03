'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterCommandResult,
  IUnifiedRegisterNoteInput,
  IUnifiedRegisterNoteRecord
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function createNoteAction(
  contribuyenteId: string,
  payload: IUnifiedRegisterNoteInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterNoteRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.createNote(contribuyenteId, payload);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible crear la nota.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
