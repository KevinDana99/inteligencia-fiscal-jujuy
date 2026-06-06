import { getJson, postJson, type ApiClientConfig } from '@/lib/api-client'
import type { ICrossManagementSource } from '../../interfaces/CrossManagementSource'
import type {
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams,
  ICrossResumenData,
  ICrossResumenRequestParams,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../../models/CrossManagement'
import type {
  ApiCrossExecutionsListResponseDto,
  ApiCrossPlanillaRequestDto,
  ApiCrossPlanillaResponseDto,
  ApiCrossResumenRequestDto,
  ApiCrossResumenResponseDto,
  ApiCrossResultsListResponseDto
} from './dtos/ApiCrossManagementDtos'
import {
  mapCrossExecutionsListResponseDto,
  mapCrossPlanillaResponseDto,
  mapCrossResumenResponseDto,
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

function mapPlanillaRequestParams(
  params: ICrossPlanillaRequestParams = {}
): ApiCrossPlanillaRequestDto {
  return {
    pagina: params.page ?? 1,
    itemsPagina: params.itemsPerPage ?? 20,
    busqueda: params.search?.trim() ?? ''
  }
}

function mapResumenRequestParams(
  params: ICrossResumenRequestParams = {}
): ApiCrossResumenRequestDto {
  return {
    pagina: params.page ?? 1,
    itemsPagina: params.itemsPerPage ?? 20,
    busqueda: params.search?.trim() ?? '',
    filtrosColumnas:
      params.columnFilters?.map((filter) => ({
        campo: filter.field,
        conector: filter.connector,
        condiciones: filter.conditions.map((condition) => ({
          operador: condition.operator,
          valor: condition.value
        }))
      })) ?? []
  }
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

  async getPlanilla(
    executionId: number,
    params: ICrossPlanillaRequestParams = {}
  ): Promise<ICrossPlanillaData> {
    const response = await postJson<
      ApiCrossPlanillaResponseDto,
      ApiCrossPlanillaRequestDto
    >(
      `/api/procesos-informacion/ejecuciones/${executionId}/planilla`,
      mapPlanillaRequestParams(params),
      this.config
    )

    return mapCrossPlanillaResponseDto(response)
  }

  async getResumen(
    executionId: number,
    params: ICrossResumenRequestParams = {}
  ): Promise<ICrossResumenData> {
    const response = await postJson<
      ApiCrossResumenResponseDto,
      ApiCrossResumenRequestDto
    >(
      `/api/procesos-informacion/ejecuciones/${executionId}/resumen`,
      mapResumenRequestParams(params),
      this.config
    )

    return mapCrossResumenResponseDto(response)
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
