import { getJson, patchJson, postFormData, postJson } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import { DEFAULT_BATCH_DETAIL_QUERY } from '../../../constants';
import type { IBatchManagementSource } from '../../interfaces/BatchManagementSource';
import type {
  IBatchAddContributorPayload,
  IBatchAvailableCrosses,
  IBatchCrossExecutionPayload,
  IBatchCrossExecutionSummary,
  IBatchDetailParams,
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
  ApiAddContributorToBatchRequestDto,
  ApiBatchAvailableCrossesResponseDto,
  ApiBatchCreateResponseDto,
  ApiBatchDetailResponseDto,
  ApiBatchListResponseDto,
  ApiBatchPreviewResponseDto,
  ApiExecuteBatchCrossRequestDto,
  ApiExecuteBatchCrossResponseDto
} from './dtos/BatchManagementDtos';
import {
  mapAddContributorToBatchRequestDto,
  mapBatchAvailableCrossesResponseDto,
  mapBatchCreateResponseDto,
  mapBatchDetailResponseDto,
  mapBatchListResponseDto,
  mapBatchPreviewResponseDto,
  mapExecuteBatchCrossRequestDto,
  mapExecuteBatchCrossResponseDto
} from './mappers/mapBatchDto';

function normalizeRequestRegime(regime: string): BatchRequestRegime {
  const normalizedRegime = regime.trim();

  if (normalizedRegime === 'CM' || normalizedRegime === 'Convenio Multilateral (CM)') {
    return 'ConvenioMultilateral';
  }

  if (normalizedRegime === 'RG' || normalizedRegime === 'Regimen Local') {
    return 'RegimenLocal';
  }

  return normalizedRegime as BatchRequestRegime;
}

function parseCuitsText(cuitsText?: string | null) {
  return (cuitsText ?? '')
    .split(/[,;\s\n\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function appendCuits(formData: FormData, cuitsText?: string | null) {
  parseCuitsText(cuitsText).forEach((cuit) => {
    formData.append('Cuits', cuit);
  });
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

function logRestBatchManagementEvent(event: unknown) {
  console.log(JSON.stringify(event, null, 2));
}

export class RestBatchManagementSource implements IBatchManagementSource {
  constructor(private readonly config: ApiClientConfig) {}

  async listAvailableCrosses(): Promise<IBatchAvailableCrosses> {
    const path = '/api/procesos-informacion/cruces';

    logRestBatchManagementEvent({
      endpoint: path,
      action: 'RestBatchManagementSource.listAvailableCrosses',
      METHOD: 'GET',
      REQUEST_RAW: {
        requestUrl: path
      }
    });

    const response = await getJson<ApiBatchAvailableCrossesResponseDto>(
      path,
      this.config
    );

    logRestBatchManagementEvent({
      endpoint: path,
      action: 'RestBatchManagementSource.listAvailableCrosses',
      METHOD: 'GET',
      RESPONSE_RAW: response
    });

    return mapBatchAvailableCrossesResponseDto(response);
  }

  async listBatches(params: IBatchListParams = {}): Promise<IBatchListData> {
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) {
      searchParams.set('Busqueda', params.search.trim());
    }

    searchParams.set('Pagina', String(params.page ?? 1));
    searchParams.set('ItemsPagina', String(params.itemsPerPage ?? 10));

    const path = searchParams.size ? `/api/lotes?${searchParams.toString()}` : '/api/lotes';
    logRestBatchManagementEvent({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.listBatches',
      METHOD: 'GET',
      REQUEST_RAW: {
        Busqueda: params.search ?? null,
        Pagina: params.page ?? 1,
        ItemsPagina: params.itemsPerPage ?? 10,
        requestUrl: path
      }
    });
    const response = await getJson<ApiBatchListResponseDto>(path, this.config);
    logRestBatchManagementEvent({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.listBatches',
      METHOD: 'GET',
      RESPONSE_RAW: response
    });

    return mapBatchListResponseDto(response);
  }

  async getBatch(
    batchId: string,
    params: IBatchDetailParams = {}
  ): Promise<IBatchManagementItem> {
    const page = params.page ?? DEFAULT_BATCH_DETAIL_QUERY.page;
    const itemsPerPage =
      params.itemsPerPage ?? DEFAULT_BATCH_DETAIL_QUERY.itemsPerPage;
    const searchParams = new URLSearchParams({
      Pagina: String(page),
      ItemsPagina: String(itemsPerPage)
    });
    const path = `/api/lotes/${batchId}?${searchParams.toString()}`;
    logRestBatchManagementEvent({
      endpoint: `/api/lotes/${batchId}`,
      action: 'RestBatchManagementSource.getBatch',
      METHOD: 'GET',
      REQUEST_RAW: {
        loteId: batchId,
        Pagina: page,
        ItemsPagina: itemsPerPage,
        requestUrl: path
      }
    });
    const response = await getJson<ApiBatchDetailResponseDto>(
      path,
      this.config
    );
    logRestBatchManagementEvent({
      endpoint: `/api/lotes/${batchId}`,
      action: 'RestBatchManagementSource.getBatch',
      METHOD: 'GET',
      RESPONSE_RAW: response
    });

    return mapBatchDetailResponseDto(response);
  }

  async previewBatchLoad(payload: IBatchPreviewPayload): Promise<IBatchPreviewData> {
    const formData = new FormData();

    if (payload.file) {
      formData.append('Archivo', payload.file);
    }

    if (payload.regime?.trim()) {
      formData.append('Regimen', normalizeRequestRegime(payload.regime.trim()));
    }

    appendCuits(formData, payload.cuitsText);
    logRestBatchManagementEvent({
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
    logRestBatchManagementEvent({
      endpoint: '/api/lotes/previsualizaciones',
      action: 'RestBatchManagementSource.previewBatchLoad',
      METHOD: 'POST',
      RESPONSE_RAW: response
    });

    return mapBatchPreviewResponseDto(response);
  }

  async createBatch(payload: IBatchCreatePayload): Promise<IBatchCreatedSummary> {
    const formData = new FormData();

    formData.append('Nombre', payload.name.trim());

    if (payload.description?.trim()) {
      formData.append('Descripcion', payload.description.trim());
    }

    formData.append('Regimen', normalizeRequestRegime(payload.regime.trim()));

    if (payload.file) {
      formData.append('Archivo', payload.file);
    }

    appendCuits(formData, payload.cuitsText);
    logRestBatchManagementEvent({
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
    logRestBatchManagementEvent({
      endpoint: '/api/lotes',
      action: 'RestBatchManagementSource.createBatch',
      METHOD: 'POST',
      RESPONSE_RAW: response
    });

    return mapBatchCreateResponseDto(response);
  }

  async addContributorToBatch(payload: IBatchAddContributorPayload): Promise<void> {
    const requestBody = mapAddContributorToBatchRequestDto(payload);

    logRestBatchManagementEvent({
      endpoint: '/api/lotes/contribuyentes',
      action: 'RestBatchManagementSource.addContributorToBatch',
      METHOD: 'PATCH',
      REQUEST_RAW: {
        body: requestBody
      }
    });

    await patchJson<null, ApiAddContributorToBatchRequestDto>(
      '/api/lotes/contribuyentes',
      requestBody,
      this.config
    );

    logRestBatchManagementEvent({
      endpoint: '/api/lotes/contribuyentes',
      action: 'RestBatchManagementSource.addContributorToBatch',
      METHOD: 'PATCH',
      RESPONSE_RAW: null
    });
  }

  async executeBatchCross(
    payload: IBatchCrossExecutionPayload
  ): Promise<IBatchCrossExecutionSummary> {
    const path = `/api/procesos-informacion/cruces/${encodeURIComponent(payload.crossCode)}/ejecuciones`;
    const requestBody = mapExecuteBatchCrossRequestDto(payload);

    logRestBatchManagementEvent({
      endpoint: '/api/procesos-informacion/cruces/{codigoCruce}/ejecuciones',
      action: 'RestBatchManagementSource.executeBatchCross',
      METHOD: 'POST',
      REQUEST_RAW: {
        codigoCruce: payload.crossCode,
        requestUrl: path,
        body: requestBody
      }
    });

    const response = await postJson<
      ApiExecuteBatchCrossResponseDto,
      ApiExecuteBatchCrossRequestDto
    >(path, requestBody, this.config);

    logRestBatchManagementEvent({
      endpoint: '/api/procesos-informacion/cruces/{codigoCruce}/ejecuciones',
      action: 'RestBatchManagementSource.executeBatchCross',
      METHOD: 'POST',
      RESPONSE_RAW: response
    });

    return mapExecuteBatchCrossResponseDto(response);
  }
}
