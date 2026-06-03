'use server';

import { createServerUnifiedRegisterSource } from '../../data-access';
import type {
  IUnifiedRegisterAlternateAddressListData,
  IUnifiedRegisterQueryResult
} from '../../models/UnifiedRegister';
import { resolveUnifiedRegisterActionError } from '../shared/resolveUnifiedRegisterActionError';

export async function getAlternateAddressesAction(
  contribuyenteId: string
): Promise<IUnifiedRegisterQueryResult<IUnifiedRegisterAlternateAddressListData>> {
  try {
    const source = await createServerUnifiedRegisterSource();
    const data = await source.listAlternateAddresses(contribuyenteId);

    return { data };
  } catch (error) {
    const resolvedError = resolveUnifiedRegisterActionError(
      error,
      'No fue posible listar los domicilios alternativos.'
    );

    return {
      data: null,
      ...resolvedError
    };
  }
}
