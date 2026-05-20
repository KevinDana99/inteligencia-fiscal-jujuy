import type {
  IBatchCreatedSummary,
  IBatchListData,
  IBatchManagementAuthor,
  IBatchManagementCuit,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewRecord
} from '../../../models/BatchManagement';
import type {
  ApiBatchAuthorDto,
  ApiBatchCreateResponseDto,
  ApiBatchCuitDto,
  ApiBatchDetailResponseDto,
  ApiBatchListItemDto,
  ApiBatchListResponseDto,
  ApiBatchPreviewRecordDto,
  ApiBatchPreviewResponseDto
} from '../dtos/BatchManagementDtos';

function mapBatchAuthor(dto: ApiBatchAuthorDto): IBatchManagementAuthor {
  return {
    id: dto.id,
    name: dto.nombre
  };
}

function mapBatchCuit(batchId: string, dto: ApiBatchCuitDto): IBatchManagementCuit {
  return {
    id: `${batchId}-${dto.orden}`,
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    regime: dto.regimen,
    order: dto.orden
  };
}

export function mapBatchListItemDto(dto: ApiBatchListItemDto): IBatchManagementItem {
  return {
    id: dto.id,
    batchNumber: dto.numeroLote,
    name: dto.nombre,
    description: dto.descripcion ?? '',
    regime: dto.regimen,
    cuitCount: dto.cantidadCuits,
    createdAt: dto.fechaGeneracion,
    createdBy: mapBatchAuthor(dto.creadoPor),
    cuits: []
  };
}

export function mapBatchListResponseDto(dto: ApiBatchListResponseDto): IBatchListData {
  return {
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    batches: dto.lotes.map(mapBatchListItemDto)
  };
}

export function mapBatchDetailResponseDto(dto: ApiBatchDetailResponseDto): IBatchManagementItem {
  return {
    id: dto.id,
    batchNumber: dto.numeroLote,
    name: dto.nombre,
    description: dto.descripcion ?? '',
    regime: dto.regimen,
    cuitCount: dto.cantidadCuits,
    createdAt: dto.fechaGeneracion,
    createdBy: mapBatchAuthor(dto.creadoPor),
    cuits: dto.cuits.map((cuit) => mapBatchCuit(dto.id, cuit))
  };
}

function mapPreviewRecord(dto: ApiBatchPreviewRecordDto): IBatchPreviewRecord {
  const statusByDto = {
    valido: 'valid',
    invalido: 'invalid',
    duplicado: 'duplicated'
  } as const;

  return {
    record: dto.registro,
    originalCuit: dto.cuitOriginal,
    normalizedCuit: dto.cuitNormalizado,
    businessName: dto.razonSocial,
    status: statusByDto[dto.estado],
    reason: dto.motivo
  };
}

export function mapBatchPreviewResponseDto(
  dto: ApiBatchPreviewResponseDto
): IBatchPreviewData {
  return {
    fileName: dto.nombreArchivo,
    foundRecords: dto.registrosEncontrados,
    validCount: dto.cantidadValidos,
    invalidCount: dto.cantidadInvalidos,
    duplicatedCount: dto.cantidadDuplicados,
    importableCount: dto.cantidadImportable,
    records: dto.registros.map(mapPreviewRecord)
  };
}

export function mapBatchCreateResponseDto(
  dto: ApiBatchCreateResponseDto
): IBatchCreatedSummary {
  return {
    id: dto.id,
    number: dto.numero,
    formattedNumber: dto.numeroFormateado,
    name: dto.nombre,
    description: dto.descripcion,
    regime: dto.regimen,
    cuitCount: dto.cantidadCuits,
    createdAt: dto.fechaGeneracion
  };
}
