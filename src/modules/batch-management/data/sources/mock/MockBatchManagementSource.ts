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

    return batch;
  }

  async previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData> {
    if (payload.file) {
      return {
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

    return {
      fileName: payload.file?.name ?? null,
      foundRecords: records.length,
      validCount,
      invalidCount,
      duplicatedCount,
      importableCount: validCount,
      records
    };
  }

  async createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary> {
    const nextNumber =
      batchManagementMock.reduce(
        (maxValue, item) => Math.max(maxValue, Number(item.batchNumber) || 0),
        0
      ) + 1;

    return {
      id: `mock-${nextNumber}`,
      number: nextNumber,
      formattedNumber: String(nextNumber),
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      regime: normalizeRegime(payload.regime),
      cuitCount: parseCuitsText(payload.cuitsText).length,
      createdAt: new Date().toISOString()
    };
  }
}
