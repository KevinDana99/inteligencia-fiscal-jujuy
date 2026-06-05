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
