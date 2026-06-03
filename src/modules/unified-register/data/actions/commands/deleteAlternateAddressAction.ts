'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type { IUnifiedRegisterCommandResult } from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function deleteAlternateAddressAction(
  contribuyenteId: string,
  domicilioAlternativoId: string
): Promise<IUnifiedRegisterCommandResult> {
  try {
    const source = await createServerUnifiedRegisterSource();
    await source.deleteAlternateAddress(contribuyenteId, domicilioAlternativoId);

    return {
      success: true,
      data: null
    };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible eliminar el domicilio alternativo.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
