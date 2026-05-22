import { deleteJson, getJson, postJson, type ApiClientConfig } from '@/lib/api-client'
import type { IReprocessingSource } from '../../interfaces/ReprocessingSource'
import type {
  IReprocessingListData,
  IReprocessingListParams,
  IReprocessingMarkedSummary,
  IReprocessingMarkPayload
} from '../../models/Reprocessing'
import type {
  ApiListReprocessingResponseDto,
  ApiMarkReprocessingRequestDto,
  ApiMarkReprocessingResponseDto
} from './dtos/ApiReprocessingDtos'
import { mapReprocessingDto } from './mappers/mapReprocessingDto'

function buildQueryString(params: IReprocessingListParams = {}) {
  const searchParams = new URLSearchParams()

  if (params.search?.trim()) {
    searchParams.set('busqueda', params.search.trim())
  }

  if (params.page) {
    searchParams.set('pagina', String(params.page))
  }

  if (params.itemsPerPage) {
    searchParams.set('itemsPagina', String(params.itemsPerPage))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export class RestReprocessingSource implements IReprocessingSource {
  constructor(private readonly config: ApiClientConfig) {}

  async listReprocessing(params: IReprocessingListParams = {}): Promise<IReprocessingListData> {
    const response = await getJson<ApiListReprocessingResponseDto>(
      `/api/reprocesos${buildQueryString(params)}`,
      this.config
    )

    return {
      page: response.pagina,
      itemsPerPage: response.itemsPagina,
      totalItems: response.totalContribuyentes,
      totalPages: response.totalPaginas,
      items: response.reprocesos.map(mapReprocessingDto)
    }
  }

  async markReprocessing(
    payload: IReprocessingMarkPayload
  ): Promise<IReprocessingMarkedSummary> {
    const requestBody: ApiMarkReprocessingRequestDto = {
      contribuyenteId: payload.contribuyenteId,
      descripcion: payload.description ?? null
    }

    const response = await postJson<
      ApiMarkReprocessingResponseDto,
      ApiMarkReprocessingRequestDto
    >('/api/reprocesos', requestBody, this.config)

    return {
      id: response.id,
      contribuyenteId: response.contribuyenteId,
      description: response.descripcion,
      isActive: response.estaActivo,
      createdAtUtc: response.fechaCreacionUtc
    }
  }

  async unmarkReprocessing(contribuyenteId: string): Promise<void> {
    await deleteJson<null>(`/api/reprocesos/${contribuyenteId}`, this.config)
  }
}
