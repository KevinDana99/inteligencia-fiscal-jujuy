import type {
  BatchCrossPeriodicity,
  IBatchAvailableCross,
  IBatchAvailableCrosses,
  IBatchAddContributorPayload,
  IBatchCrossExecutionPayload,
  IBatchCrossExecutionSummary,
  IBatchCreatedSummary,
  IBatchListData,
  IBatchManagementAuthor,
  IBatchManagementCuit,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewRecord
} from '../../../models/BatchManagement';
import type {
  ApiAddContributorToBatchRequestDto,
  ApiBatchAvailableCrossDto,
  ApiBatchAvailableCrossesResponseDto,
  ApiBatchAuthorDto,
  ApiBatchCreateResponseDto,
  ApiBatchCuitDto,
  ApiBatchDetailResponseDto,
  ApiBatchListItemDto,
  ApiBatchListResponseDto,
  ApiBatchPreviewRecordDto,
  ApiBatchPreviewResponseDto,
  ApiExecuteBatchCrossRequestDto,
  ApiExecuteBatchCrossResponseDto
} from '../dtos/BatchManagementDtos';

type ApiRecord = Record<string, unknown>;

const BATCH_CROSS_LABELS_BY_PUBLIC_CODE: Record<string, string> = {
  'desvio-bi-convenio-multilateral': 'Control de desvio de BI - Regimen CM'
};

function mapBatchAuthor(dto: ApiBatchAuthorDto): IBatchManagementAuthor {
  return {
    id: dto.id,
    name: dto.nombre
  };
}

function normalizeBusinessName(value?: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue || trimmedValue === '-' || trimmedValue === '—') {
    return null;
  }

  return trimmedValue;
}

function getBusinessName(dto: {
  razonSocial?: string | null;
  RazonSocial?: string | null;
  razon_social?: string | null;
}) {
  return (
    normalizeBusinessName(dto.razonSocial) ??
    normalizeBusinessName(dto.RazonSocial) ??
    normalizeBusinessName(dto.razon_social)
  );
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStringField(dto: ApiRecord, keys: string[]) {
  for (const key of keys) {
    const value = dto[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  return null;
}

function normalizePeriodicity(value: string | null): BatchCrossPeriodicity {
  const normalized = (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (
    normalized.includes('mensual') ||
    normalized.includes('monthly') ||
    normalized === 'mes' ||
    normalized === 'm'
  ) {
    return 'monthly';
  }

  return 'annual';
}

function withPeriodicity(
  item: unknown,
  periodicity: BatchCrossPeriodicity
): ApiBatchAvailableCrossDto | null {
  if (!isRecord(item)) {
    return null;
  }

  return {
    ...item,
    periodicidad: periodicity === 'monthly' ? 'Mensual' : 'Anual'
  } as ApiBatchAvailableCrossDto;
}

function getAvailableCrossItems(
  dto: ApiBatchAvailableCrossesResponseDto
): ApiBatchAvailableCrossDto[] {
  if (Array.isArray(dto)) {
    return dto;
  }

  if (!isRecord(dto)) {
    return [];
  }

  const record = dto as ApiRecord;
  const groupedItems = [
    ...[
      record.crucesMensuales,
      record.CrucesMensuales,
      record.monthlyCrosses,
      record.crucesMonthly
    ].flatMap((value) =>
      Array.isArray(value)
        ? value
            .map((item) => withPeriodicity(item, 'monthly'))
            .filter((item): item is ApiBatchAvailableCrossDto => Boolean(item))
        : []
    ),
    ...[
      record.crucesAnuales,
      record.CrucesAnuales,
      record.annualCrosses,
      record.crucesAnnual
    ].flatMap((value) =>
      Array.isArray(value)
        ? value
            .map((item) => withPeriodicity(item, 'annual'))
            .filter((item): item is ApiBatchAvailableCrossDto => Boolean(item))
        : []
    )
  ];

  if (groupedItems.length) {
    return groupedItems;
  }

  for (const key of ['cruces', 'items', 'data', 'resultados']) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord) as ApiBatchAvailableCrossDto[];
    }

    if (isRecord(value)) {
      const nestedItems = getAvailableCrossItems(
        value as ApiBatchAvailableCrossesResponseDto
      );

      if (nestedItems.length) {
        return nestedItems;
      }
    }
  }

  return [];
}

function mapAvailableCrossDto(dto: ApiBatchAvailableCrossDto): IBatchAvailableCross | null {
  const record = dto as ApiRecord;
  const publicCode = getStringField(record, [
    'codigoCruce',
    'codigo',
    'code',
    'clave',
    'id'
  ]);

  if (!publicCode) {
    return null;
  }

  const version =
    getStringField(record, ['versionCruce', 'version', 'versionActual']) ?? '1.0.0';
  const label =
    getStringField(record, [
      'nombreCruce',
      'nombre',
      'name',
      'etiqueta',
      'titulo',
      'descripcion'
    ]) ??
    BATCH_CROSS_LABELS_BY_PUBLIC_CODE[publicCode] ??
    publicCode;

  return {
    id: `${publicCode}:${version}`,
    label,
    publicCode,
    version,
    periodicity: normalizePeriodicity(
      getStringField(record, [
        'periodicidad',
        'tipoPeriodicidad',
        'frecuencia',
        'granularidad',
        'periodo',
        'tipoPeriodo'
      ])
    )
  };
}

function mapBatchCuit(batchId: string, dto: ApiBatchCuitDto): IBatchManagementCuit {
  return {
    id: `${batchId}-${dto.orden}`,
    cuit: dto.cuit,
    businessName: getBusinessName(dto),
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

export function mapBatchAvailableCrossesResponseDto(
  dto: ApiBatchAvailableCrossesResponseDto
): IBatchAvailableCrosses {
  const seen = new Set<string>();

  return getAvailableCrossItems(dto).reduce<IBatchAvailableCrosses>((crosses, item) => {
    const cross = mapAvailableCrossDto(item);

    if (!cross || seen.has(cross.id)) {
      return crosses;
    }

    seen.add(cross.id);
    crosses.push(cross);

    return crosses;
  }, []);
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
    businessName: getBusinessName(dto),
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
  const formattedNumber =
    dto.numeroFormateado ?? dto.numeroLote ?? String(dto.numero ?? '');
  const parsedNumber = Number(dto.numero ?? formattedNumber);

  return {
    id: dto.id ?? formattedNumber,
    number: Number.isNaN(parsedNumber) ? 0 : parsedNumber,
    formattedNumber,
    name: dto.nombre,
    description: dto.descripcion,
    regime: dto.regimen,
    cuitCount: dto.cantidadCuits,
    createdAt: dto.fechaGeneracion
  };
}

export function mapAddContributorToBatchRequestDto(
  payload: IBatchAddContributorPayload
): ApiAddContributorToBatchRequestDto {
  return {
    loteId: payload.batchId,
    contribuyente: {
      cuit: payload.contributor.cuit,
      razonSocial: normalizeBusinessName(payload.contributor.businessName),
      regimen: payload.contributor.regime
    }
  };
}

export function mapExecuteBatchCrossRequestDto(
  payload: IBatchCrossExecutionPayload
): ApiExecuteBatchCrossRequestDto {
  return {
    versionCruce: payload.crossVersion,
    tipoOrigen: 'por_lote',
    loteId: payload.batchId,
    contribuyenteId: null,
    periodoInicio: payload.periodFrom,
    periodoFin: payload.periodTo,
    parametros: payload.parameters ?? {}
  };
}

export function mapExecuteBatchCrossResponseDto(
  dto: ApiExecuteBatchCrossResponseDto
): IBatchCrossExecutionSummary {
  return {
    executionId: dto.ejecucionId,
    crossCode: dto.codigoCruce,
    crossVersion: dto.versionCruce,
    status: dto.estado,
    idempotencyKey: dto.claveIdempotencia,
    requestedAt: dto.fechaSolicitud
  };
}
