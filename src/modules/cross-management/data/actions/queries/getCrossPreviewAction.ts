'use server'

import {
  DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
  DEFAULT_CROSS_PREVIEW_PAGE,
  MAX_CROSS_PREVIEW_EXECUTIONS_FALLBACK_ITEMS
} from '../../../constants/crossPreviewRequest'
import { mapCrossPreviewContractToView } from '../../mappers/mapCrossPreviewContractToView'
import type {
  ICrossManagementQueryResult,
  ICrossPreviewData
} from '../../models/CrossManagement'
import { getCrossManagementAction } from './getCrossManagementAction'
import { getCrossPlanillaAction } from './getCrossPlanillaAction'
import { getCrossResumenAction } from './getCrossResumenAction'

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

  const [planillaResponse, resumenResponse, executionsResponse] = await Promise.all([
    getCrossPlanillaAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    }),
    getCrossResumenAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE,
      columnFilters: []
    }),
    getCrossManagementAction({
      itemsPerPage: MAX_CROSS_PREVIEW_EXECUTIONS_FALLBACK_ITEMS,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    })
  ])

  if (!planillaResponse.data) {
    return {
      data: null,
      error: planillaResponse.error,
      code: planillaResponse.code,
      status: planillaResponse.status
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

  const execution =
    executionsResponse.data?.items.find((item) => item.id === crossId) ?? null

  return {
    data: mapCrossPreviewContractToView(
      executionId,
      planillaResponse.data,
      resumenResponse.data,
      execution
    )
  }
}
