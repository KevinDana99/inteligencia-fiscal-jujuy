'use server'

import {
  DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
  DEFAULT_CROSS_PREVIEW_PAGE
} from '../../../constants/crossPreviewRequest'
import { mapCrossResultsToPreview } from '../../mappers/mapCrossResultsToPreview'
import type {
  ICrossManagementQueryResult,
  ICrossPreviewData
} from '../../models/CrossManagement'
import { getCrossManagementAction } from './getCrossManagementAction'
import { getCrossResultsAction } from './getCrossResultsAction'

export async function getCrossPreviewAction(
  crossId: string
): Promise<ICrossManagementQueryResult<ICrossPreviewData>> {
  const executionId = Number(crossId)

  if (!Number.isInteger(executionId) || executionId <= 0) {
    return {
      data: null,
      error: 'Identificador de cruce inválido.'
    }
  }

  const [resultsResponse, executionsResponse] = await Promise.all([
    getCrossResultsAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    }),
    getCrossManagementAction({
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    })
  ])

  if (!resultsResponse.data) {
    return {
      data: null,
      error: resultsResponse.error,
      code: resultsResponse.code,
      status: resultsResponse.status
    }
  }

  const execution =
    executionsResponse.data?.items.find((item) => item.id === crossId) ?? null

  return {
    data: mapCrossResultsToPreview(executionId, resultsResponse.data, execution)
  }
}
