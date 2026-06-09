'use server'

import type { ConfigurationType } from '../../models/Configuration'
import { createServerConfigurationSource } from '../../data-access'

export interface IConfigurationQueryResult {
  data: ConfigurationType | null
  error?: string
}

export async function getConfigurationAction(): Promise<IConfigurationQueryResult> {
  try {
    const source = await createServerConfigurationSource()
    const data = await source.getConfiguration()

    return { data }
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'No fue posible cargar la configuración global.'
    }
  }
}
