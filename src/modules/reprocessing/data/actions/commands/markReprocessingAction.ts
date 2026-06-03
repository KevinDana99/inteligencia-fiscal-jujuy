'use server'

import { ApiClientError } from '@/lib/api-client'
import type {
  IReprocessingCommandResult,
  IReprocessingMarkPayload,
  IReprocessingMarkedSummary
} from '../../models/Reprocessing'
import { createServerReprocessingSource } from '../../data-access'

export async function markReprocessingAction(
  payload: IReprocessingMarkPayload
): Promise<IReprocessingCommandResult<IReprocessingMarkedSummary>> {
  const endpoint = '/api/reprocesos'
  const action = 'markReprocessingAction'
  const METHOD = 'POST'
  const REQUEST = {
    contribuyenteId: payload.contribuyenteId,
    descripcion: payload.description ?? null
  }

  try {
    const source = await createServerReprocessingSource()
    const data = await source.markReprocessing(payload)

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST,
      RESPONSE: {
        id: data.id,
        contribuyenteId: data.contribuyenteId,
        descripcion: data.description,
        estaActivo: data.isActive,
        fechaCreacionUtc: data.createdAtUtc
      }
    })

    return {
      success: true,
      data
    }
  } catch (error) {
    const apiError = error instanceof ApiClientError ? error : null

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST,
      RESPONSE: {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: apiError?.status,
        data: apiError?.data ?? null
      }
    })

    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: apiError?.status
    }
  }
}
