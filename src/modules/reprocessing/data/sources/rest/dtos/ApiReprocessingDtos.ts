export type ApiReprocessingError = {
  codigo: string
  mensaje: string
  estado: number
}

export type ApiReprocessingAuthorDto = {
  creadoPorUsuarioId: string
  nombre: string
}

export type ApiReprocessingLastCrossDto = {
  id: string
  nombre: string
} | null

export type ApiReprocessingContributorDto = {
  contribuyenteId: string
  cuit: string
  razonSocial: string
}

export type ApiReprocessingItemDto = {
  id: string
  fechaCreacion: string
  descripcion: string | null
  autor: ApiReprocessingAuthorDto
  ultimoCruce: ApiReprocessingLastCrossDto
  contribuyente: ApiReprocessingContributorDto
}

export type ApiListReprocessingResponseDto = {
  pagina: number
  itemsPagina: number
  totalContribuyentes: number
  totalPaginas: number
  reprocesos: ApiReprocessingItemDto[]
}

export type ApiMarkReprocessingRequestDto = {
  cuit: string
  descripcion?: string | null
}

export type ApiMarkReprocessingResponseDto = {
  id: string
  contribuyenteId: string
  descripcion: string | null
  estaActivo: boolean
  fechaCreacionUtc: string
}
