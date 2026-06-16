export interface ApiCrossExecutionDto {
  ejecucionId: number
  codigoCruce: string
  nombreCruce: string
  estado: string
  origen: string
  cuit: string | null
  lote: string | null
  periodoInicio: string
  periodoFin: string
  cantidadTotalCuits: number
  fechaEjecucion: string
}

export interface ApiCrossExecutionsListResponseDto {
  pagina: number
  itemsPagina: number
  totalItems: number
  totalPaginas: number
  ejecuciones: ApiCrossExecutionDto[]
}

export interface ApiCrossResultSourceDto {
  codigo: string
  preparacionFuenteId: string | null
  estadoCobertura: string
  obligatoria: boolean
}

export interface ApiCrossResultDto {
  resultadoId: number
  ejecucionId: number
  codigoCruce: string
  versionCruce: string
  contribuyenteId: string
  cuit: string
  granularidadResultado: string
  periodoResultado: string
  periodoResultadoDesde: string
  periodoResultadoHasta: string
  estadoCalculo: string
  metricas: Record<string, unknown>
  detalleDinamico: Record<string, unknown>
  fuentes: ApiCrossResultSourceDto[]
  camposNoCalculables: string[]
  fechaCreacion: string
}

export interface ApiCrossResultsListResponseDto {
  pagina: number
  itemsPagina: number
  totalItems: number
  totalPaginas: number
  resultadosCruces: ApiCrossResultDto[]
}

export type ApiCrossDynamicColumnTypeDto = 'string' | 'numero' | 'fecha'

export type ApiCrossFilterOperatorDto =
  | 'mayorQue'
  | 'mayorOIgualQue'
  | 'menorQue'
  | 'menorOIgualQue'
  | 'igualA'
  | 'distintoDe'

export type ApiCrossFilterConnectorDto = 'Y' | 'O'

export interface ApiCrossDynamicColumnDto {
  clave: string
  tipo: ApiCrossDynamicColumnTypeDto
  etiqueta: string
  esFiltrable?: boolean
  operadoresPermitidos?: ApiCrossFilterOperatorDto[]
}

export interface ApiCrossDynamicSchemaDto {
  columnas: ApiCrossDynamicColumnDto[]
}

export interface ApiCrossDynamicValuesRowDto {
  textos?: Record<string, string | null>
  fechas?: Record<string, string | null>
  metricas?: Record<string, number | null>
}

export interface ApiCrossPlanillaRowDto extends ApiCrossDynamicValuesRowDto {
  contribuyenteId?: string | null
  cuit: string
  razonSocial: string | null
}

export interface ApiCrossPlanillaRequestDto {
  pagina: number
  itemsPagina: number
  busqueda: string
}

export interface ApiCrossPlanillaResponseDto {
  esquema: ApiCrossDynamicSchemaDto | null
  pagina: number
  itemsPagina: number
  totalItems: number
  totalPaginas: number
  filas: ApiCrossPlanillaRowDto[]
}

export interface ApiCrossResumenFilterConditionDto {
  operador: ApiCrossFilterOperatorDto
  valor: string
}

export interface ApiCrossResumenColumnFilterDto {
  campo: string
  conector: ApiCrossFilterConnectorDto
  condiciones: ApiCrossResumenFilterConditionDto[]
}

export interface ApiCrossResumenRequestDto {
  pagina: number
  itemsPagina: number
  busqueda: string
  filtrosColumnas: ApiCrossResumenColumnFilterDto[]
}

export interface ApiCrossResumenMetadataDto {
  ejecucionId?: number
  codigoCruce?: string
  versionCruce?: string
  titulo?: string | null
  subtitulo?: string | null
  loteCuit?: string | null
  periodo?: string | null
  totalCuitsEjecucion?: number
  cuitsRelevantes?: number | null
}

export interface ApiCrossResumenBlockDto {
  clave: string
  titulo: string
  esquema?: ApiCrossDynamicSchemaDto
  columnas?: ApiCrossDynamicColumnDto[]
  filas: ApiCrossDynamicValuesRowDto[]
}

export interface ApiCrossAnalysisRowDto extends ApiCrossDynamicValuesRowDto {
  cuit: string
  razonSocial: string | null
  estadoRelevancia: string | null
}

export interface ApiCrossAnalysisPaginationDto {
  pagina: number
  itemsPagina: number
  totalItems: number
  totalPaginas: number
  filas: ApiCrossAnalysisRowDto[]
}

export interface ApiCrossResumenResponseDto {
  metadatos: ApiCrossResumenMetadataDto
  bloquesResumen: ApiCrossResumenBlockDto[] | null
  esquemaAnalisisSistemico: ApiCrossDynamicSchemaDto | null
  analisisSistemico: ApiCrossAnalysisPaginationDto
}

export interface ApiExecuteCrossRequestDto {
  versionCruce: string
  tipoOrigen: 'por_lote' | 'individual'
  loteId: string | null
  contribuyenteId: string | null
  periodoInicio: string
  periodoFin: string
  parametros: Record<string, string | null>
}

export interface ApiExecuteCrossResponseDto {
  ejecucionId: number
  codigoCruce: string
  versionCruce: string
  estado: string
  claveIdempotencia: string
  fechaSolicitud: string
}
