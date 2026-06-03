'use server'

import { ApiClientError } from '@/lib/api-client'
import type { IReprocessingCommandResult } from '../../models/Reprocessing'
import { createServerReprocessingSource } from '../../data-access'

export async function unmarkReprocessingAction(
  contribuyenteId: string
): Promise<IReprocessingCommandResult> {
  const endpoint = `/api/reprocesos/${contribuyenteId}`
  const action = 'unmarkReprocessingAction'
  const METHOD = 'DELETE'
  const REQUEST = { contribuyenteId }

  try {
    const source = await createServerReprocessingSource()
    await source.unmarkReprocessing(contribuyenteId)

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST,
      RESPONSE: {
        success: true,
        status: 204
      }
    })

    return {
      success: true,
      data: null
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
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
