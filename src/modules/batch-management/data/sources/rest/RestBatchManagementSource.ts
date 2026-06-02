import { getJson, postFormData } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import type { IBatchManagementSource } from '../../interfaces/BatchManagementSource';
import type {
  BatchRequestRegime,
  IBatchCreatePayload,
  IBatchCreatedSummary,
  IBatchListData,
  IBatchListParams,
  IBatchManagementItem,
  IBatchPreviewData,
  IBatchPreviewPayload
} from '../../models/BatchManagement';
import type {
  ApiBatchCreateResponseDto,
  ApiBatchDetailResponseDto,
  ApiBatchListResponseDto,
  ApiBatchPreviewResponseDto
} from './dtos/BatchManagementDtos';
import {
  mapBatchCreateResponseDto,
  mapBatchDetailResponseDto,
  mapBatchListResponseDto,
  mapBatchPreviewResponseDto
} from './mappers/mapBatchDto';

function normalizeRequestRegime(regime: string): BatchRequestRegime {
  if (regime === 'RG') {
    return 'Regimen Local';
  }

  return regime as BatchRequestRegime;
}

function appendCuits(formData: FormData, cuitsText?: string | null) {
  if (!cuitsText?.trim()) {
    return;
  }

  formData.append('cuits', cuitsText);
}

function getFormDataEntries(formData: FormData) {
  return Array.from(formData.entries()).map(([key, value]) => ({
    key,
    value:
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size
          }
        : value
  }));
}

export class RestBatchManagementSource implements IBatchManagementSource {
  constructor(private readonly config: ApiClientConfig) {}

  async listBatches(params: IBatchListParams = {}): Promise<IBatchListData> {
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) {
      searchParams.set('busqueda', params.search.trim());
    }

    searchParams.set('pagina', String(params.page ?? 1));
    searchParams.set('itemsPagina', String(params.itemsPerPage ?? 20));

    const path = searchParams.size ? `/api/lotes?${searchParams.toString()}` : '/api/lotes';
    console.log({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.listBatches',
      METHOD: 'GET',
      REQUEST_RAW: {
        busqueda: params.search ?? null,
        pagina: params.page ?? 1,
        itemsPagina: params.itemsPerPage ?? 20,
        requestUrl: path
      }
    });
    const response = await getJson<ApiBatchListResponseDto>(path, this.config);
    console.log({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.listBatches',
      METHOD: 'GET',
      RESPONSE_RAW: response
    });

    return mapBatchListResponseDto(response);
  }

  async getBatch(batchId: string): Promise<IBatchManagementItem> {
    const path = `/api/lotes/${batchId}`;
    console.log({
      endpoint: path,
      action: 'RestBatchManagementSource.getBatch',
      METHOD: 'GET',
      REQUEST_RAW: {
        loteId: batchId,
        requestUrl: path
      }
    });
    const response = await getJson<ApiBatchDetailResponseDto>(
      path,
      this.config
    );
    console.log({
      endpoint: path,
      action: 'RestBatchManagementSource.getBatch',
      METHOD: 'GET',
      RESPONSE_RAW: response
    });

    return mapBatchDetailResponseDto(response);
  }

  async previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData> {
    const formData = new FormData();

    if (payload.file) {
      formData.append('archivo', payload.file);
    }

    if (payload.regime?.trim()) {
      formData.append('regimen', normalizeRequestRegime(payload.regime.trim()));
    }

    appendCuits(formData, payload.cuitsText);
    console.log({
      endpoint: '/api/lotes/previsualizaciones',
      action: 'RestBatchManagementSource.previewBatchLoad',
      METHOD: 'POST',
      REQUEST_RAW: {
        formDataEntries: getFormDataEntries(formData)
      }
    });

    const response = await postFormData<ApiBatchPreviewResponseDto>(
      '/api/lotes/previsualizaciones',
      formData,
      this.config
    );
    console.log({
      endpoint: '/api/lotes/previsualizaciones',
      action: 'RestBatchManagementSource.previewBatchLoad',
      METHOD: 'POST',
      RESPONSE_RAW: response
    });

    return mapBatchPreviewResponseDto(response);
  }

  async createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary> {
    const formData = new FormData();

    formData.append('nombre', payload.name.trim());

    if (payload.description?.trim()) {
      formData.append('descripcion', payload.description.trim());
    }

    formData.append('regimen', normalizeRequestRegime(payload.regime.trim()));

    if (payload.file) {
      formData.append('archivo', payload.file);
    }

    appendCuits(formData, payload.cuitsText);
    console.log({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.createBatch',
      METHOD: 'POST',
      REQUEST_RAW: {
        formDataEntries: getFormDataEntries(formData)
      }
    });

    const response = await postFormData<ApiBatchCreateResponseDto>(
      '/api/lotes',
      formData,
      this.config
    );
    console.log({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.createBatch',
      METHOD: 'POST',
      RESPONSE_RAW: response
    });

    return mapBatchCreateResponseDto(response);
  }
}
