'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterCommandResult,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function updateContactAction(
  contribuyenteId: string,
  contactoId: string,
  payload: IUnifiedRegisterContactInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterContactRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.updateContact(contribuyenteId, contactoId, payload);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible editar el contacto.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
