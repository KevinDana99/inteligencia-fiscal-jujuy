'use server'

import { ApiClientError } from '@/lib/api-client'
import { createServerCrossManagementSource } from '../../data-access'
import type {
  ICrossManagementQueryResult,
  ICrossResumenData,
  ICrossResumenRequestParams
} from '../../models/CrossManagement'

export async function getCrossResumenAction(
  executionId: number,
  params: ICrossResumenRequestParams = {}
): Promise<ICrossManagementQueryResult<ICrossResumenData>> {
  try {
    const source = await createServerCrossManagementSource()
    const data = await source.getResumen(executionId, params)

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
          : 'No fue posible obtener el resumen del cruce.'
    }
  }
}
