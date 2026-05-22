'use server'

import { ApiClientError } from '@/lib/api-client'
import type {
  IReprocessingListData,
  IReprocessingListParams,
  IReprocessingQueryResult
} from '../../models/Reprocessing'
import { createServerReprocessingSource } from '../../data-access'

export async function getReprocessingAction(
  params: IReprocessingListParams = {}
): Promise<IReprocessingQueryResult<IReprocessingListData>> {
  const endpoint = '/api/reprocesos'
  const action = 'getReprocessingAction'
  const METHOD = 'GET'
  const REQUEST = {
    busqueda: params.search ?? null,
    pagina: params.page ?? 1,
    itemsPagina: params.itemsPerPage ?? 10
  }
  const searchParams = new URLSearchParams()

  if (REQUEST.busqueda?.trim()) {
    searchParams.set('busqueda', REQUEST.busqueda.trim())
  }

  searchParams.set('pagina', String(REQUEST.pagina))
  searchParams.set('itemsPagina', String(REQUEST.itemsPagina))

  const requestUrl = `${endpoint}?${searchParams.toString()}`

  try {
    const source = await createServerReprocessingSource()
    const data = await source.listReprocessing(params)

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST: {
        ...REQUEST,
        requestUrl
      },
      RESPONSE: {
        totalContribuyentes: data.totalItems,
        totalPaginas: data.totalPages,
        pagina: data.page,
        itemsPagina: data.itemsPerPage,
        items: data.items.map((item) => ({
          id: item.id,
          contribuyenteId: item.contribuyenteId,
          cuit: item.cuit,
          razonSocial: item.businessName,
          ultimoCruce: item.lastCross
        }))
      }
    })

    return {
      data
    }
  } catch (error) {
    const apiError = error instanceof ApiClientError ? error : null

    console.log({
      endpoint,
      action,
      METHOD,
      REQUEST: {
        ...REQUEST,
        requestUrl
      },
      RESPONSE: {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: apiError?.status,
        data: apiError?.data ?? null
      }
    })

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
