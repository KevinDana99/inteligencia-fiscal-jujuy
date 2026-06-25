'use server'

import {
  DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
  DEFAULT_CROSS_PREVIEW_PAGE
} from '../../../constants/crossPreviewRequest'
import { mapCrossPreviewContractToView } from '../../mappers/mapCrossPreviewContractToView'
import type {
  ICrossAvailableView,
  ICrossManagementQueryResult,
  ICrossPlanillaData,
  ICrossPreviewData
} from '../../models/CrossManagement'
import { getCrossManagementAction } from './getCrossManagementAction'
import { getCrossPlanillaAction } from './getCrossPlanillaAction'
import { getCrossResumenAction } from './getCrossResumenAction'

const EMPTY_PLANILLA_DATA: ICrossPlanillaData = {
  schema: null,
  page: DEFAULT_CROSS_PREVIEW_PAGE,
  itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
  totalItems: 0,
  totalPages: 0,
  rows: []
}
const EXECUTIONS_LOOKUP_ITEMS_PER_PAGE = 100

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

  const [executionsResponse, resumenResponse] = await Promise.all([
    getCrossManagementAction({
      itemsPerPage: EXECUTIONS_LOOKUP_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE
    }),
    getCrossResumenAction(executionId, {
      itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
      page: DEFAULT_CROSS_PREVIEW_PAGE,
      columnFilters: []
    })
  ])

  if (!resumenResponse.data) {
    return {
      data: null,
      error: resumenResponse.error,
      code: resumenResponse.code,
      status: resumenResponse.status
    }
  }

  const execution =
    executionsResponse.data?.items.find((item) => item.id === String(executionId)) ??
    null
  const viewsAvailable: ICrossAvailableView[] =
    execution?.viewsAvailable ?? ['resumen']
  const planillaResponse = viewsAvailable.includes('planilla')
    ? await getCrossPlanillaAction(executionId, {
        itemsPerPage: DEFAULT_CROSS_PREVIEW_ITEMS_PER_PAGE,
        page: DEFAULT_CROSS_PREVIEW_PAGE,
        search: ''
      })
    : null

  if (planillaResponse && !planillaResponse.data) {
    return {
      data: null,
      error: planillaResponse.error,
      code: planillaResponse.code,
      status: planillaResponse.status
    }
  }

  return {
    data: mapCrossPreviewContractToView(
      executionId,
      planillaResponse?.data ?? EMPTY_PLANILLA_DATA,
      resumenResponse.data,
      execution,
      viewsAvailable
    )
  }
}
