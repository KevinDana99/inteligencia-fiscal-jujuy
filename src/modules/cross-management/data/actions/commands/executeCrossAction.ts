'use server'

import { createServerCrossManagementSource } from '../../data-access'
import type {
  ICrossExecutionPayload,
  ICrossExecutionSummary,
  ICrossManagementCommandResult
} from '../../models/CrossManagement'
import { resolveCrossManagementActionError } from '../shared/resolveCrossManagementActionError'

export async function executeCrossAction(
  payload: ICrossExecutionPayload
): Promise<ICrossManagementCommandResult<ICrossExecutionSummary>> {
  try {
    const source = await createServerCrossManagementSource()
    const data = await source.executeCross(payload)
    const result = {
      success: true as const,
      data
    }

    console.log(
      JSON.stringify(
        {
          action: 'executeCrossAction',
          payload,
          result
        },
        null,
        2
      )
    )

    return result
  } catch (error) {
    const result = {
      success: false,
      data: null,
      ...resolveCrossManagementActionError(
        error,
        'No fue posible ejecutar el cruce.'
      )
    }

    console.log(
      JSON.stringify(
        {
          action: 'executeCrossAction',
          payload,
          result
        },
        null,
        2
      )
    )

    return result
  }
}
