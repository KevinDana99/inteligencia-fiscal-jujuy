'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type { IUnifiedRegisterCommandResult } from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function deleteContactAction(
  contribuyenteId: string,
  contactoId: string
): Promise<IUnifiedRegisterCommandResult> {
  try {
    const source = await createServerUnifiedRegisterSource();
    await source.deleteContact(contribuyenteId, contactoId);

    return {
      success: true,
      data: null
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible eliminar el contacto.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
