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
    const response = await getJson<ApiBatchListResponseDto>(path, this.config);

    return mapBatchListResponseDto(response);
  }

  async getBatch(batchId: string): Promise<IBatchManagementItem> {
    const response = await getJson<ApiBatchDetailResponseDto>(
      `/api/lotes/${batchId}`,
      this.config
    );

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

    const response = await postFormData<ApiBatchPreviewResponseDto>(
      '/api/lotes/previsualizaciones',
      formData,
      this.config
    );

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

    const response = await postFormData<ApiBatchCreateResponseDto>(
      '/api/lotes',
      formData,
      this.config
    );

    return mapBatchCreateResponseDto(response);
  }
}
