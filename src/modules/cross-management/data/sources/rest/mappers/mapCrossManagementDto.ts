import type {
  ICrossAvailableView,
  ICrossManagementItem,
  ICrossManagementListData,
  ICrossAnalysisData,
  ICrossAnalysisRow,
  ICrossDynamicColumn,
  ICrossDynamicValuesRow,
  ICrossPlanillaData,
  ICrossPlanillaRow,
  ICrossResumenBlock,
  ICrossResumenData,
  ICrossResumenMetadata,
  ICrossResumenSection,
  ICrossResultItem,
  ICrossResultSource,
  ICrossResultsListData
} from '../../../models/CrossManagement'
import type {
  ApiCrossAnalysisPaginationDto,
  ApiCrossAnalysisRowDto,
  ApiCrossDynamicColumnDto,
  ApiCrossDynamicValuesRowDto,
  ApiCrossExecutionDto,
  ApiCrossExecutionsListResponseDto,
  ApiCrossPlanillaRowDto,
  ApiCrossPlanillaResponseDto,
  ApiCrossResultDto,
  ApiCrossResultsListResponseDto,
  ApiCrossResultSourceDto,
  ApiCrossResumenBlockDto,
  ApiCrossResumenMetadataDto,
  ApiCrossResumenResponseDto,
  ApiCrossResumenSectionDto
} from '../dtos/ApiCrossManagementDtos'

const DEFAULT_AVAILABLE_VIEWS: ICrossAvailableView[] = ['resumen', 'planilla']
const SUPPORTED_AVAILABLE_VIEWS = new Set<ICrossAvailableView>([
  'resumen',
  'planilla'
])

function mapAvailableViews(value: string[] | null | undefined): ICrossAvailableView[] {
  const views =
    value?.filter((view): view is ICrossAvailableView =>
      SUPPORTED_AVAILABLE_VIEWS.has(view as ICrossAvailableView)
    ) ?? []

  return views.length ? views : DEFAULT_AVAILABLE_VIEWS
}

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
    date: formatDateLabel(dto.fechaEjecucion),
    status: dto.estado,
    viewsAvailable: mapAvailableViews(dto.vistasDisponibles)
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

export function mapCrossDynamicColumnDto(
  dto: ApiCrossDynamicColumnDto
): ICrossDynamicColumn {
  return {
    key: dto.clave,
    type: dto.tipo,
    label: dto.etiqueta,
    isFilterable: Boolean(dto.esFiltrable),
    allowedOperators: dto.operadoresPermitidos ?? []
  }
}

export function mapCrossDynamicValuesRowDto(
  dto: ApiCrossDynamicValuesRowDto
): ICrossDynamicValuesRow {
  return {
    texts: dto.textos ?? {},
    dates: dto.fechas ?? {},
    metrics: dto.metricas ?? {}
  }
}

export function mapCrossPlanillaRowDto(
  dto: ApiCrossPlanillaRowDto
): ICrossPlanillaRow {
  const rowWithAliases = dto as ApiCrossPlanillaRowDto & {
    contribuyente_id?: string | null
    taxpayerId?: string | null
  }

  return {
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    taxpayerId:
      dto.contribuyenteId ??
      rowWithAliases.contribuyente_id ??
      rowWithAliases.taxpayerId ??
      null,
    ...mapCrossDynamicValuesRowDto(dto)
  }
}

export function mapCrossPlanillaResponseDto(
  dto: ApiCrossPlanillaResponseDto
): ICrossPlanillaData {
  return {
    schema: dto.esquema
      ? {
          columns: dto.esquema.columnas.map(mapCrossDynamicColumnDto)
        }
      : null,
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    rows: dto.filas.map(mapCrossPlanillaRowDto)
  }
}

function mapCrossResumenMetadataDto(
  dto: ApiCrossResumenMetadataDto
): ICrossResumenMetadata {
  return {
    executionId: dto.ejecucionId ?? null,
    crossCode: dto.codigoCruce ?? null,
    crossVersion: dto.versionCruce ?? null,
    title: dto.titulo ?? null,
    subtitle: dto.subtitulo ?? null,
    batchOrCuit: dto.loteCuit ?? null,
    period: dto.periodo ?? null,
    totalCuits: dto.totalCuitsEjecucion ?? 0,
    relevantCuits: dto.cuitsRelevantes ?? null
  }
}

function mapCrossResumenBlockDto(
  dto: ApiCrossResumenBlockDto
): ICrossResumenBlock {
  return {
    key: dto.clave,
    title: dto.titulo,
    columns: (dto.esquema?.columnas ?? dto.columnas ?? []).map(
      mapCrossDynamicColumnDto
    ),
    rows: dto.filas.map(mapCrossDynamicValuesRowDto)
  }
}

function mapCrossAnalysisRowDto(dto: ApiCrossAnalysisRowDto): ICrossAnalysisRow {
  return {
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    taxpayerId: dto.contribuyenteId ?? dto.contribuyente_id ?? dto.taxpayerId ?? null,
    relevanceStatus: dto.estadoRelevancia,
    ...mapCrossDynamicValuesRowDto(dto)
  }
}

function mapCrossAnalysisPaginationDto(
  dto: ApiCrossAnalysisPaginationDto | null | undefined
): ICrossAnalysisData {
  if (!dto) {
    return {
      page: 1,
      itemsPerPage: 20,
      totalItems: 0,
      totalPages: 0,
      rows: []
    }
  }

  return {
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    rows: dto.filas.map(mapCrossAnalysisRowDto)
  }
}

function mapCrossResumenSectionDto(
  dto: ApiCrossResumenSectionDto
): ICrossResumenSection {
  return {
    key: dto.clave,
    title: dto.titulo,
    type: dto.tipo,
    columns: (dto.esquema?.columnas ?? []).map(mapCrossDynamicColumnDto),
    summaryRows: dto.filasResumen?.map(mapCrossDynamicValuesRowDto) ?? null,
    grid: dto.grilla ? mapCrossAnalysisPaginationDto(dto.grilla) : null
  }
}

function buildLegacyResumenSections({
  analysis,
  analysisSchema,
  summaryBlocks
}: {
  analysis: ICrossAnalysisData
  analysisSchema: ICrossDynamicColumn[]
  summaryBlocks: ICrossResumenBlock[] | null
}): ICrossResumenSection[] {
  const summarySections =
    summaryBlocks?.map((block) => ({
      key: block.key,
      title: block.title,
      type: 'resumen' as const,
      columns: block.columns,
      summaryRows: block.rows,
      grid: null
    })) ?? []

  const analysisSections =
    analysisSchema.length || analysis.rows.length
      ? [
          {
            key: 'analisis-sistemico',
            title: 'Análisis sistémico por CUIT',
            type: 'grilla' as const,
            columns: analysisSchema,
            summaryRows: null,
            grid: analysis
          }
        ]
      : []

  return [...summarySections, ...analysisSections]
}

export function mapCrossResumenResponseDto(
  dto: ApiCrossResumenResponseDto
): ICrossResumenData {
  const metadata = mapCrossResumenMetadataDto(dto.metadatos ?? {})
  const summaryBlocks = dto.bloquesResumen?.map(mapCrossResumenBlockDto) ?? null
  const analysisSchema =
    dto.esquemaAnalisisSistemico?.columnas.map(mapCrossDynamicColumnDto) ?? []
  const analysis = mapCrossAnalysisPaginationDto(dto.analisisSistemico)
  const mappedSections = dto.secciones?.map(mapCrossResumenSectionDto) ?? []
  const sections = mappedSections.length
    ? mappedSections
    : buildLegacyResumenSections({
        analysis,
        analysisSchema,
        summaryBlocks
      })
  const firstGridSection = sections.find((section) => section.type === 'grilla')
  const resolvedAnalysis = firstGridSection?.grid ?? analysis
  const resolvedAnalysisSchema =
    firstGridSection?.columns.length ? firstGridSection.columns : analysisSchema

  return {
    metadata,
    sections,
    summaryBlocks,
    analysisSchema: resolvedAnalysisSchema.length
      ? {
          columns: resolvedAnalysisSchema
        }
      : null,
    analysis: resolvedAnalysis
  }
}
