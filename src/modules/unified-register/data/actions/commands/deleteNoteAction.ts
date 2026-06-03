'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type { IUnifiedRegisterCommandResult } from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function deleteNoteAction(
  contribuyenteId: string,
  notaId: string
): Promise<IUnifiedRegisterCommandResult> {
  try {
    const source = await createServerUnifiedRegisterSource();
    await source.deleteNote(contribuyenteId, notaId);

    return {
      success: true,
      data: null
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible borrar la nota.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
