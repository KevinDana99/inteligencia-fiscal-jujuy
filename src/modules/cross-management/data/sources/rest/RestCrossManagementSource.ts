import { getJson, postJson, type ApiClientConfig } from '@/lib/api-client'
import { INTIMATION_DOCUMENT_API_ENDPOINTS } from '../../constants/intimationDocumentContracts'
import type { ICrossManagementSource } from '../../interfaces/CrossManagementSource'
import type {
  ICrossExecutionPayload,
  ICrossExecutionSummary,
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams,
  ICrossResumenData,
  ICrossResumenRequestParams,
  ICrossResultsListData,
  ICrossResultsListParams,
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '../../models/CrossManagement'
import type {
  ApiGenerateIntimationDocumentRequestDto,
  ApiGenerateIntimationDocumentResponseDto
} from './dtos/ApiIntimationDocumentDtos'
import type {
  ApiCrossExecutionsListResponseDto,
  ApiExecuteCrossRequestDto,
  ApiExecuteCrossResponseDto,
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
import { normalizeCrossSearchRequest } from '../../utils/crossSearch'
import { normalizeIntimationDocumentPayload } from '../../utils/normalizeIntimationDocumentPayload'

function logRestCrossManagementEvent(event: unknown) {
  console.log(JSON.stringify(event, null, 2))
}

function buildExecutionsQueryString(params: ICrossManagementListParams = {}) {
  const searchParams = new URLSearchParams()
  const search = normalizeCrossSearchRequest(params.search)

  if (search) {
    searchParams.set('Busqueda', search)
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
    busqueda: normalizeCrossSearchRequest(params.search)
  }
}

function mapResumenRequestParams(
  params: ICrossResumenRequestParams = {}
): ApiCrossResumenRequestDto {
  return {
    pagina: params.page ?? 1,
    itemsPagina: params.itemsPerPage ?? 20,
    busqueda: normalizeCrossSearchRequest(params.search),
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

function mapExecuteCrossRequest(
  payload: ICrossExecutionPayload
): ApiExecuteCrossRequestDto {
  return {
    versionCruce: payload.crossVersion,
    tipoOrigen: payload.originType,
    loteId: payload.batchId ?? null,
    contribuyenteId: payload.contributorId ?? null,
    periodoInicio: payload.periodFrom,
    periodoFin: payload.periodTo,
    parametros: payload.parameters ?? {}
  }
}

function mapExecuteCrossResponse(
  dto: ApiExecuteCrossResponseDto
): ICrossExecutionSummary {
  return {
    executionId: dto.ejecucionId,
    crossCode: dto.codigoCruce,
    crossVersion: dto.versionCruce,
    status: dto.estado,
    idempotencyKey: dto.claveIdempotencia,
    requestedAt: dto.fechaSolicitud
  }
}

function resolveStringValue(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim())
}

function extractDocumentIdFromUrl(url: string | null | undefined) {
  if (!url) {
    return null
  }

  const match = url.match(/\/api\/documentos\/([^/]+)\/descargar/i)

  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function mapGenerateIntimationDocumentResponse(
  response: ApiGenerateIntimationDocumentResponseDto
): IIntimationDocumentGeneratedSummary {
  if (typeof response === 'string' && response.trim()) {
    return {
      documentId: response,
      downloadUrl: ''
    }
  }

  if (typeof response !== 'object' || response === null) {
    throw new Error(
      'El backend no devolvió el identificador del documento generado.'
    )
  }

  const downloadUrl = resolveStringValue(
    response.urlDescarga,
    response.downloadUrl,
    response.url
  )
  const documentId = resolveStringValue(
    response.documentoId,
    response.documentId,
    response.id,
    extractDocumentIdFromUrl(downloadUrl)
  )

  if (!documentId) {
    throw new Error(
      'El backend no devolvió el identificador del documento generado.'
    )
  }

  return {
    documentId,
    downloadUrl: downloadUrl ?? ''
  }
}

export class RestCrossManagementSource implements ICrossManagementSource {
  constructor(private readonly config: ApiClientConfig) {}

  async executeCross(
    payload: ICrossExecutionPayload
  ): Promise<ICrossExecutionSummary> {
    const path = `/api/procesos-informacion/cruces/${encodeURIComponent(payload.crossCode)}/ejecuciones`
    const requestBody = mapExecuteCrossRequest(payload)

    logRestCrossManagementEvent({
      endpoint: '/api/procesos-informacion/cruces/{codigoCruce}/ejecuciones',
      action: 'RestCrossManagementSource.executeCross',
      METHOD: 'POST',
      REQUEST_RAW: {
        codigoCruce: payload.crossCode,
        requestUrl: path,
        body: requestBody
      }
    })

    const response = await postJson<
      ApiExecuteCrossResponseDto,
      ApiExecuteCrossRequestDto
    >(path, requestBody, this.config)

    logRestCrossManagementEvent({
      endpoint: '/api/procesos-informacion/cruces/{codigoCruce}/ejecuciones',
      action: 'RestCrossManagementSource.executeCross',
      METHOD: 'POST',
      RESPONSE_RAW: response
    })

    return mapExecuteCrossResponse(response)
  }

  async generateIntimationDocument(
    payload: IGenerateIntimationDocumentPayload
  ): Promise<IIntimationDocumentGeneratedSummary> {
    const requestPayload = normalizeIntimationDocumentPayload(payload)

    console.info({
      action: 'RestCrossManagementSource.generateIntimationDocument.request',
      baseUrl: this.config.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: INTIMATION_DOCUMENT_API_ENDPOINTS.generate,
      format: requestPayload.formato,
      hasContributorId: Boolean(requestPayload.contribuyente.id),
      rowsCount: requestPayload.filasPlanilla.length,
      selectedColumnsCount: requestPayload.columnasSeleccionadas.length
    })

    const response = await postJson<
      ApiGenerateIntimationDocumentResponseDto,
      ApiGenerateIntimationDocumentRequestDto
    >(
      INTIMATION_DOCUMENT_API_ENDPOINTS.generate,
      requestPayload,
      this.config
    )

    console.info({
      action: 'RestCrossManagementSource.generateIntimationDocument.raw_response',
      responseType: typeof response,
      responseKeys:
        typeof response === 'object' && response !== null
          ? Object.keys(response)
          : []
    })

    const mappedResponse = mapGenerateIntimationDocumentResponse(response)

    console.info({
      action: 'RestCrossManagementSource.generateIntimationDocument.response',
      responseType: typeof response,
      responseKeys:
        typeof response === 'object' && response !== null
          ? Object.keys(response)
          : [],
      documentId: mappedResponse.documentId,
      hasDownloadUrl: Boolean(mappedResponse.downloadUrl)
    })

    return mappedResponse
  }

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
