'use server';

import { createServerExplorerRegisterSource } from '../../data-access';
import type {
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload,
  IExplorerRegisterQueryResult
} from '../../models/ExplorerRegister';
import { mapExplorerRegisterActionError } from '../../utils';

export async function exploreExplorerRegisterAction(
  payload: IExplorerRegisterExplorePayload
): Promise<IExplorerRegisterQueryResult<IExplorerRegisterExploreData>> {
  try {
    const source = await createServerExplorerRegisterSource();
    const data = await source.explore(payload);

    return { data };
  } catch (error) {
    return mapExplorerRegisterActionError<IExplorerRegisterExploreData>(
      error,
      'No fue posible explorar el padron.'
    );
  }
}
