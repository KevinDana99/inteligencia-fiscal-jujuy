'use server'

import type { ConfigurationType } from '../../models/Configuration'
import { createServerConfigurationSource } from '../../data-access'

export interface IConfigurationQueryResult {
  data: ConfigurationType | null
  error?: string
}

export async function getConfigurationAction(): Promise<IConfigurationQueryResult> {
  try {
    console.log({
      action: 'getConfigurationAction',
      request: {
        endpoints: [
          '/api/configuracion/intimacion',
          '/api/configuracion/informe'
        ]
      }
    })

    const source = await createServerConfigurationSource()
    const data = await source.getConfiguration()

    console.log({
      action: 'getConfigurationAction.response',
      response: data
    })

    return { data }
  } catch (error) {
    console.log({
      action: 'getConfigurationAction.error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'No fue posible cargar la configuración global.'
    }
  }
}
