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

    console.log({
      endpoint: '/api/super-administrador/dominios-permitidos',
      action: 'getAllowedDomainsAction',
      METHOD: 'GET',
      REQUEST: null,
      RESPONSE: data.map((domain) => ({
        id: domain.id,
        dominio: domain.domain
      }))
    })

    return {
      data
    }
  } catch (error) {
    console.log({
      endpoint: '/api/super-administrador/dominios-permitidos',
      action: 'getAllowedDomainsAction',
      METHOD: 'GET',
      REQUEST: null,
      RESPONSE: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
