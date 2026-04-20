'use server';

import type { IAdminPanelData, IModuleQueryResult } from '../../models/AdminPanel';
import { createServerAdminPanelSource } from '../../data-access';

export async function getAdminPanelAction(): Promise<
  IModuleQueryResult<IAdminPanelData>
> {
  try {
    const source = await createServerAdminPanelSource();
    const data = await source.getAdminPanelData();

    return {
      data
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
