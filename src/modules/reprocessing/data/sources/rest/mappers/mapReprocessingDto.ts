import type { IReprocessingItem } from '../../../models/Reprocessing'
import type { ApiReprocessingItemDto } from '../dtos/ApiReprocessingDtos'

function mapLastCrossLabel(value: string | null | undefined) {
  if (!value) {
    return 'Sin cruce'
  }

  return value
    .split('_')
    .map((chunk) => chunk.charAt(0) + chunk.slice(1).toLowerCase())
    .join(' ')
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

function formatCuit(value: string) {
  const normalizedValue = value.replace(/\D/g, '')

  if (normalizedValue.length !== 11) {
    return value
  }

  return `${normalizedValue.slice(0, 2)}-${normalizedValue.slice(2, 10)}-${normalizedValue.slice(10)}`
}

export function mapReprocessingDto(dto: ApiReprocessingItemDto): IReprocessingItem {
  return {
    id: dto.id,
    contribuyenteId: dto.contribuyente.contribuyenteId,
    cuit: formatCuit(dto.contribuyente.cuit),
    businessName: dto.contribuyente.razonSocial,
    createdAt: dto.fechaCreacion,
    date: formatDateLabel(dto.fechaCreacion),
    markedByUserId: dto.autor.creadoPorUsuarioId,
    markedBy: dto.autor.nombre,
    lastCrossId: dto.ultimoCruce?.id ?? null,
    lastCross: mapLastCrossLabel(dto.ultimoCruce?.nombre),
    notes: dto.descripcion ?? 'Sin observaciones',
    isReprocessing: true
  }
}
