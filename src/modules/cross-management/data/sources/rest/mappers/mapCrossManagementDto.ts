import type {
  ICrossManagementItem,
  ICrossManagementListData,
  ICrossResultItem,
  ICrossResultSource,
  ICrossResultsListData
} from '../../../models/CrossManagement'
import type {
  ApiCrossExecutionDto,
  ApiCrossExecutionsListResponseDto,
  ApiCrossResultDto,
  ApiCrossResultsListResponseDto,
  ApiCrossResultSourceDto
} from '../dtos/ApiCrossManagementDtos'

function formatDateLabel(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = String(parsedDate.getFullYear())

  return `${day}/${month}/${year}`
}

function parseDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return { day, month, year }
}

function formatPeriodLabel(periodFrom: string, periodTo: string) {
  const from = parseDateOnly(periodFrom)
  const to = parseDateOnly(periodTo)

  if (!from.year || !to.year) {
    return periodFrom === periodTo ? periodFrom : `${periodFrom}-${periodTo}`
  }

  const isFullSameYear =
    from.year === to.year &&
    from.month === 1 &&
    from.day === 1 &&
    to.month === 12 &&
    to.day === 31

  if (isFullSameYear) {
    return String(from.year)
  }

  const fromLabel = `${String(from.month).padStart(2, '0')}/${from.year}`
  const toLabel = `${String(to.month).padStart(2, '0')}/${to.year}`

  return fromLabel === toLabel ? fromLabel : `${fromLabel}-${toLabel}`
}

function mapOrigin(origin: string): ICrossManagementItem['source'] {
  return origin.toLowerCase().includes('lote') ? 'Lote' : 'Padrón'
}

export function mapCrossExecutionDto(dto: ApiCrossExecutionDto): ICrossManagementItem {
  return {
    id: String(dto.ejecucionId),
    name: dto.nombreCruce,
    source: mapOrigin(dto.origen),
    sourceRef: dto.lote ?? dto.cuit ?? '-',
    period: formatPeriodLabel(dto.periodoInicio, dto.periodoFin),
    cuitCount: dto.cantidadTotalCuits,
    date: formatDateLabel(dto.fechaEjecucion)
  }
}

export function mapCrossExecutionsListResponseDto(
  dto: ApiCrossExecutionsListResponseDto
): ICrossManagementListData {
  return {
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    items: dto.ejecuciones.map(mapCrossExecutionDto)
  }
}

function mapCrossResultSourceDto(dto: ApiCrossResultSourceDto): ICrossResultSource {
  return {
    code: dto.codigo,
    sourcePreparationId: dto.preparacionFuenteId,
    coverageStatus: dto.estadoCobertura,
    required: dto.obligatoria
  }
}

export function mapCrossResultDto(dto: ApiCrossResultDto): ICrossResultItem {
  return {
    id: String(dto.resultadoId),
    executionId: dto.ejecucionId,
    crossCode: dto.codigoCruce,
    crossVersion: dto.versionCruce,
    taxpayerId: dto.contribuyenteId,
    cuit: dto.cuit,
    granularity: dto.granularidadResultado,
    period: dto.periodoResultado,
    periodFrom: dto.periodoResultadoDesde,
    periodTo: dto.periodoResultadoHasta,
    calculationStatus: dto.estadoCalculo,
    metrics: dto.metricas,
    dynamicDetail: dto.detalleDinamico,
    sources: dto.fuentes.map(mapCrossResultSourceDto),
    nonCalculableFields: dto.camposNoCalculables,
    createdAt: dto.fechaCreacion
  }
}

export function mapCrossResultsListResponseDto(
  dto: ApiCrossResultsListResponseDto
): ICrossResultsListData {
  return {
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    results: dto.resultadosCruces.map(mapCrossResultDto)
  }
}
