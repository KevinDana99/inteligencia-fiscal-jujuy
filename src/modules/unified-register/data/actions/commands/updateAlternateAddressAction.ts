'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterAlternateAddressInput,
  IUnifiedRegisterAlternateAddressRecord,
  IUnifiedRegisterCommandResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function updateAlternateAddressAction(
  contribuyenteId: string,
  domicilioAlternativoId: string,
  payload: IUnifiedRegisterAlternateAddressInput
): Promise<IUnifiedRegisterCommandResult<IUnifiedRegisterAlternateAddressRecord>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.updateAlternateAddress(
      contribuyenteId,
      domicilioAlternativoId,
      payload
    );

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible editar el domicilio alternativo.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
