'use server'

import { ApiClientError } from '@/lib/api-client'
import { createServerCrossManagementSource } from '../../data-access'
import type {
  ICrossManagementQueryResult,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams
} from '../../models/CrossManagement'

export async function getCrossPlanillaAction(
  executionId: number,
  params: ICrossPlanillaRequestParams = {}
): Promise<ICrossManagementQueryResult<ICrossPlanillaData>> {
  try {
    const source = await createServerCrossManagementSource()
    const data = await source.getPlanilla(executionId, params)

    return { data }
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiData = error.data as
        | { codigo?: string; mensaje?: string; estado?: number }
        | undefined

      return {
        data: null,
        error: apiData?.mensaje ?? error.message,
        code: apiData?.codigo,
        status: apiData?.estado ?? error.status
      }
    }

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'No fue posible obtener la planilla del cruce.'
    }
  }
}
