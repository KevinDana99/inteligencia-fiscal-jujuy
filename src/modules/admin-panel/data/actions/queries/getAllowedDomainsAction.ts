'use server'

import type {
  IAdminAllowedDomains,
  IModuleQueryResult
} from '../../models/AdminPanel'
import { createServerAdminPanelSource } from '../../data-access'

export async function getAllowedDomainsAction(): Promise<
  IModuleQueryResult<IAdminAllowedDomains>
> {
  try {
    const source = await createServerAdminPanelSource()
    const data = await source.getAllowedDomains()

    return {
      data
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
