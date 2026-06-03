'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterCommandResult,
  IUnifiedRegisterContactInput,
  IUnifiedRegisterContactRecord
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function createContactAction(
  contribuyenteId: string,
  payload: IUnifiedRegisterContactInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterContactRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.createContact(contribuyenteId, payload);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible crear el contacto.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
