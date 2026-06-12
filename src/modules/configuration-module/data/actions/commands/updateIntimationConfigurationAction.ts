'use server'

import type { IntimationType } from '../../models/Configuration'
import { createServerConfigurationSource } from '../../data-access'

export interface IUpdateIntimationConfigurationActionResult {
  success: boolean
  error?: string
}

export async function updateIntimationConfigurationAction(
  plantillaId: string,
  configuration: IntimationType
): Promise<IUpdateIntimationConfigurationActionResult> {
  try {
    const source = await createServerConfigurationSource()

    await source.updateIntimationConfiguration(plantillaId, configuration)

    console.log({
      endpoint: `/api/configuracion/intimacion/${plantillaId}`,
      action: 'updateIntimationConfigurationAction',
      METHOD: 'PUT',
      REQUEST: {
        asunto: configuration.asunto,
        saludo: configuration.saludo,
        cuerpo: configuration.cuerpo,
        fuenteInformacion: configuration.fuente_informacion ?? null,
        fechaCorte: configuration.pie,
        columnas_seleccionadas: configuration.columnas_seleccionadas
      },
      RESPONSE: {
        success: true,
        status: 204
      }
    })

    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible guardar la configuración de intimación.'

    console.log({
      endpoint: `/api/configuracion/intimacion/${plantillaId}`,
      action: 'updateIntimationConfigurationAction',
      METHOD: 'PUT',
      REQUEST: {
        asunto: configuration.asunto,
        saludo: configuration.saludo,
        cuerpo: configuration.cuerpo,
        fuenteInformacion: configuration.fuente_informacion ?? null,
        fechaCorte: configuration.pie,
        columnas_seleccionadas: configuration.columnas_seleccionadas
      },
      RESPONSE: {
        success: false,
        error: message
      }
    })

    return {
      success: false,
      error: message
    }
  }
}
