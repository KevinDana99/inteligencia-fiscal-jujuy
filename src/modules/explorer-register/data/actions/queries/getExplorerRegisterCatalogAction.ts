'use server';

import { createServerExplorerRegisterSource } from '../../data-access';
import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterQueryResult
} from '../../models/ExplorerRegister';
import { mapExplorerRegisterActionError } from '../../utils';

export async function getExplorerRegisterCatalogAction(): Promise<
  IExplorerRegisterQueryResult<IExplorerRegisterCatalog>
> {
  try {
    const source = await createServerExplorerRegisterSource();
    const data = await source.getCatalog();

    return { data };
  } catch (error) {
    return mapExplorerRegisterActionError<IExplorerRegisterCatalog>(
      error,
      'No fue posible consultar el catalogo de filtros del padron.'
    );
  }
}
