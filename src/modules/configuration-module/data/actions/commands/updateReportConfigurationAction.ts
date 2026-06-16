'use server'

import type { ReportType } from '../../models/Configuration'
import { createServerConfigurationSource } from '../../data-access'

export interface IUpdateReportConfigurationActionResult {
  success: boolean
  error?: string
}

export async function updateReportConfigurationAction(
  plantillaId: string,
  configuration: ReportType
): Promise<IUpdateReportConfigurationActionResult> {
  try {
    const source = await createServerConfigurationSource()

    await source.updateReportConfiguration(plantillaId, configuration)

    console.log({
      endpoint: `/api/configuracion/informe/${plantillaId}`,
      action: 'updateReportConfigurationAction',
      METHOD: 'PUT',
      REQUEST: {
        titulo: configuration.titulo,
        cuerpo: configuration.cuerpo
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
        : 'No fue posible guardar la configuración de informe.'

    console.log({
      endpoint: `/api/configuracion/informe/${plantillaId}`,
      action: 'updateReportConfigurationAction',
      METHOD: 'PUT',
      REQUEST: {
        titulo: configuration.titulo,
        cuerpo: configuration.cuerpo
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
