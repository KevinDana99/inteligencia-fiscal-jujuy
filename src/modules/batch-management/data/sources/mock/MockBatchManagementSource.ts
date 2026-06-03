import type { IBatchManagementSource } from '../../interfaces/BatchManagementSource';
import type {
  IBatchCreatePayload,
  IBatchCreatedSummary,
  IBatchListData,
  IBatchListParams,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewPayload
} from '../../models/BatchManagement';
import { batchManagementMock } from './fixtures/batches';

let nextBatchSequence = batchManagementMock.reduce(
  (maxValue, item) => Math.max(maxValue, Number(item.batchNumber) || 0),
  0
);

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function parseCuitsText(cuitsText?: string | null) {
  return (cuitsText ?? '')
    .split(/[,;\s\n\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRegime(regime: string) {
  if (regime === 'CM' || regime === 'Convenio Multilateral') {
    return 'Convenio Multilateral' as const;
  }

  if (regime === 'No inscripto' || regime === 'NoInscripto') {
    return 'No inscripto' as const;
  }

  return 'Regimen Local' as const;
}

function toRawAuthor(author: IBatchManagementItem['createdBy']) {
  return author
    ? {
        id: author.id,
        nombre: author.name
      }
    : null;
}

function toRawListItem(batch: IBatchManagementItem) {
  return {
    id: batch.id,
    numeroLote: batch.batchNumber,
    nombre: batch.name,
    descripcion: batch.description,
    regimen: batch.regime,
    cantidadCuits: batch.cuitCount,
    fechaGeneracion: batch.createdAt,
    creadoPor: toRawAuthor(batch.createdBy)
  };
}

function toRawDetailCuit(cuit: IBatchManagementItem['cuits'][number]) {
  return {
    id: cuit.id,
    cuit: cuit.cuit,
    razonSocial: cuit.businessName,
    tipoContribuyente: cuit.regime,
    orden: cuit.order
  };
}

function toRawPreviewRecord(record: IBatchPreviewData['records'][number]) {
  const statusMap = {
    valid: 'valido',
    invalid: 'invalido',
    duplicated: 'duplicado'
  } as const;

  return {
    registro: record.record,
    cuitOriginal: record.originalCuit,
    cuitNormalizado: record.normalizedCuit,
    razonSocial: record.businessName,
    estado: statusMap[record.status],
    motivo: record.reason
  };
}

export class MockBatchManagementSource implements IBatchManagementSource {
  async listBatches(params: IBatchListParams = {}): Promise<IBatchListData> {
    const normalizedSearch = normalizeSearchValue(params.search ?? '');
    const items = normalizedSearch
      ? batchManagementMock.filter(
          (batch) =>
            batch.name.toLowerCase().includes(normalizedSearch) ||
            batch.batchNumber === normalizedSearch
        )
      : batchManagementMock;

    const requestUrl = `/api/lotes?pagina=${params.page ?? 1}&itemsPagina=${params.itemsPerPage ?? 20}${
      params.search?.trim() ? `&busqueda=${encodeURIComponent(params.search.trim())}` : ''
    }`;

    console.log(
      JSON.stringify(
        {
          endpoint: '/api/lotes',
          action: 'MockBatchManagementSource.listBatches',
          METHOD: 'GET',
          REQUEST_RAW: {
            busqueda: params.search ?? null,
            pagina: params.page ?? 1,
            itemsPagina: params.itemsPerPage ?? 20,
            requestUrl
          },
          RESPONSE_RAW: {
            pagina: 1,
            itemsPagina: 20,
            totalItems: items.length,
            totalPaginas: 1,
            lotes: items.map(toRawListItem)
          }
        },
        null,
        2
      )
    );

    return {
      page: 1,
      itemsPerPage: 20,
      totalItems: items.length,
      totalPages: 1,
      batches: items
    };
  }

  async getBatch(batchId: string): Promise<IBatchManagementItem> {
    const batch = batchManagementMock.find((item) => item.id === batchId);

    if (!batch) {
      throw new Error('Batch not found');
    }

    console.log(
      JSON.stringify(
        {
          endpoint: `/api/lotes/${batchId}`,
          action: 'MockBatchManagementSource.getBatch',
          METHOD: 'GET',
          REQUEST_RAW: {
            loteId: batchId,
            requestUrl: `/api/lotes/${batchId}`
          },
          RESPONSE_RAW: {
            ...toRawListItem(batch),
            cuits: batch.cuits.map(toRawDetailCuit)
          }
        },
        null,
        2
      )
    );

    return batch;
  }

  async previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData> {
    if (payload.file) {
      const response: IBatchPreviewData = {
        fileName: payload.file.name,
        foundRecords: 6,
        validCount: 5,
        invalidCount: 1,
        duplicatedCount: 0,
        importableCount: 5,
        records: [
          {
            record: 1,
            originalCuit: '30-70123456-8',
            normalizedCuit: '30701234568',
            businessName: 'DISTRIBUIDORA NORTE ANDINO S.A.',
            status: 'valid',
            reason: null
          },
          {
            record: 2,
            originalCuit: '20-28456789-4',
            normalizedCuit: '20284567894',
            businessName: 'COMERCIAL PUNA NORTE S.R.L.',
            status: 'valid',
            reason: null
          },
          {
            record: 3,
            originalCuit: '30-61234567-2',
            normalizedCuit: '30612345672',
            businessName: 'TRANSPORTES QUEBRADA ALTA S.A.',
            status: 'valid',
            reason: null
          },
          {
            record: 4,
            originalCuit: '27-32178654-3',
            normalizedCuit: '27321786543',
            businessName: 'MINERA ALTIPLANO JUJUY S.A.',
            status: 'valid',
            reason: null
          },
          {
            record: 5,
            originalCuit: '30-55467891-0',
            normalizedCuit: '30554678910',
            businessName: 'AGRO HUMAHUACA S.R.L.',
            status: 'valid',
            reason: null
          },
          {
            record: 6,
            originalCuit: '99-00000000-0',
            normalizedCuit: null,
            businessName: null,
            status: 'invalid',
            reason: 'El CUIT no tiene un formato valido.'
          }
        ]
      };

      console.log(
        JSON.stringify(
          {
            endpoint: '/api/lotes/previsualizaciones',
            action: 'MockBatchManagementSource.previewBatchLoad',
            METHOD: 'POST',
            REQUEST_RAW: {
              archivo: {
                name: payload.file.name,
                type: payload.file.type,
                size: payload.file.size
              },
              regimen: payload.regime ?? null,
              cuits: payload.cuitsText ?? null
            },
            RESPONSE_RAW: {
              nombreArchivo: response.fileName,
              registrosEncontrados: response.foundRecords,
              cantidadValidos: response.validCount,
              cantidadInvalidos: response.invalidCount,
              cantidadDuplicados: response.duplicatedCount,
              cantidadImportable: response.importableCount,
              registros: response.records.map(toRawPreviewRecord)
            }
          },
          null,
          2
        )
      );

      return response;
    }

    const cuits = parseCuitsText(payload.cuitsText);
    const normalizedMap = new Set<string>();
    const records = cuits.map((cuit, index) => {
      const normalized = cuit.replace(/\D/g, '');
      const isFormatValid = normalized.length === 11;
      const isDuplicated = normalizedMap.has(normalized);

      if (isFormatValid && !isDuplicated) {
        normalizedMap.add(normalized);
      }

      if (!isFormatValid) {
        return {
          record: index + 1,
          originalCuit: cuit,
          normalizedCuit: null,
          businessName: null,
          status: 'invalid' as const,
          reason: 'El CUIT no tiene un formato valido.'
        };
      }

      if (isDuplicated) {
        return {
          record: index + 1,
          originalCuit: cuit,
          normalizedCuit: normalized,
          businessName: null,
          status: 'duplicated' as const,
          reason: 'El CUIT esta duplicado en la carga.'
        };
      }

      return {
        record: index + 1,
        originalCuit: cuit,
        normalizedCuit: normalized,
        businessName: null,
        status: 'valid' as const,
        reason: null
      };
    });

    const validCount = records.filter((record) => record.status === 'valid').length;
    const invalidCount = records.filter((record) => record.status === 'invalid').length;
    const duplicatedCount = records.filter((record) => record.status === 'duplicated').length;

    const response = {
      fileName: null,
      foundRecords: records.length,
      validCount,
      invalidCount,
      duplicatedCount,
      importableCount: validCount,
      records
    };

    console.log(
      JSON.stringify(
        {
          endpoint: '/api/lotes/previsualizaciones',
          action: 'MockBatchManagementSource.previewBatchLoad',
          METHOD: 'POST',
          REQUEST_RAW: {
            archivo: null,
            regimen: payload.regime ?? null,
            cuits: payload.cuitsText ?? null
          },
          RESPONSE_RAW: {
            nombreArchivo: response.fileName,
            registrosEncontrados: response.foundRecords,
            cantidadValidos: response.validCount,
            cantidadInvalidos: response.invalidCount,
            cantidadDuplicados: response.duplicatedCount,
            cantidadImportable: response.importableCount,
            registros: response.records.map(toRawPreviewRecord)
          }
        },
        null,
        2
      )
    );

    return response;
  }

  async createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary> {
    nextBatchSequence += 1;
    const nextNumber = nextBatchSequence;

    const response = {
      id: `mock-${nextNumber}`,
      number: nextNumber,
      formattedNumber: String(nextNumber),
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      regime: normalizeRegime(payload.regime),
      cuitCount: parseCuitsText(payload.cuitsText).length,
      createdAt: new Date().toISOString()
    };

    console.log(
      JSON.stringify(
        {
          endpoint: '/api/lotes',
          action: 'MockBatchManagementSource.createBatch',
          METHOD: 'POST',
          REQUEST_RAW: {
            nombre: payload.name.trim(),
            descripcion: payload.description?.trim() || null,
            regimen: payload.regime,
            archivo: payload.file
              ? {
                  name: payload.file.name,
                  type: payload.file.type,
                  size: payload.file.size
                }
              : null,
            cuits: payload.cuitsText?.trim() || null
          },
          RESPONSE_RAW: {
            id: response.id,
            numero: response.number,
            numeroFormateado: response.formattedNumber,
            nombre: response.name,
            descripcion: response.description,
            regimen: response.regime,
            cantidadCuits: response.cuitCount,
            fechaGeneracion: response.createdAt
          }
        },
        null,
        2
      )
    );

    return response;
  }
}
