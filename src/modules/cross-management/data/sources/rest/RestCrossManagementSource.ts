import { getJson, type ApiClientConfig } from '@/lib/api-client'
import type { ICrossManagementSource } from '../../interfaces/CrossManagementSource'
import type {
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../../models/CrossManagement'
import type {
  ApiCrossExecutionsListResponseDto,
  ApiCrossResultsListResponseDto
} from './dtos/ApiCrossManagementDtos'
import {
  mapCrossExecutionsListResponseDto,
  mapCrossResultsListResponseDto
} from './mappers/mapCrossManagementDto'

function buildExecutionsQueryString(params: ICrossManagementListParams = {}) {
  const searchParams = new URLSearchParams()

  if (params.search?.trim()) {
    searchParams.set('Busqueda', params.search.trim())
  }

  searchParams.set('Pagina', String(params.page ?? 1))
  searchParams.set('ItemsPagina', String(params.itemsPerPage ?? 20))

  return `?${searchParams.toString()}`
}

function buildResultsQueryString(params: ICrossResultsListParams = {}) {
  const searchParams = new URLSearchParams()

  searchParams.set('Pagina', String(params.page ?? 1))
  searchParams.set('ItemsPagina', String(params.itemsPerPage ?? 20))

  return `?${searchParams.toString()}`
}

export class RestCrossManagementSource implements ICrossManagementSource {
  constructor(private readonly config: ApiClientConfig) {}

  async listExecutions(
    params: ICrossManagementListParams = {}
  ): Promise<ICrossManagementListData> {
    const response = await getJson<ApiCrossExecutionsListResponseDto>(
      `/api/procesos-informacion/ejecuciones${buildExecutionsQueryString(params)}`,
      this.config
    )

    return mapCrossExecutionsListResponseDto(response)
  }

  async listResults(
    executionId: number,
    params: ICrossResultsListParams = {}
  ): Promise<ICrossResultsListData> {
    const response = await getJson<ApiCrossResultsListResponseDto>(
      `/api/procesos-informacion/ejecuciones/${executionId}/resultados-cruces${buildResultsQueryString(params)}`,
      this.config
    )

    return mapCrossResultsListResponseDto(response)
  }
}
