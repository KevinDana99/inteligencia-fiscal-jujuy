'use server'

import {
  DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
  DEFAULT_CROSS_PREVIEW_PAGE
} from '../../../constants/crossPreviewRequest'
import {
  mapCrossPreviewContractToView,
  mapCrossResultsToPlanillaData
} from '../../mappers/mapCrossPreviewContractToView'
import type {
  ICrossManagementQueryResult,
  ICrossPreviewData
} from '../../models/CrossManagement'
import { getCrossResumenAction } from './getCrossResumenAction'
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

  const [resultsResponse, resumenResponse] = await Promise.all([
    getCrossResultsAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    }),
    getCrossResumenAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE,
      columnFilters: []
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

  if (!resumenResponse.data) {
    return {
      data: null,
      error: resumenResponse.error,
      code: resumenResponse.code,
      status: resumenResponse.status
    }
  }

  const planillaData = mapCrossResultsToPlanillaData(resultsResponse.data)

  return {
    data: mapCrossPreviewContractToView(
      executionId,
      planillaData,
      resumenResponse.data
    )
  }
}
