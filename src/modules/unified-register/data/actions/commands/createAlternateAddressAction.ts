'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterCommandResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function createAlternateAddressAction(
  contribuyenteId: string,
  payload: IUnifiedRegisterAlternateAddressInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterAlternateAddressRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.createAlternateAddress(contribuyenteId, payload);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible crear el domicilio alternativo.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
