import { getJson, postJson, type ApiClientConfig } from '@/lib/api-client';
import { EXPLORER_REGISTER_API_ENDPOINTS } from '../../../constants';
import type { IExplorerRegisterSource } from '../../interfaces/ExplorerRegisterSource';
import type {
  IExplorerRegisterCatalog,
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload
} from '../../models/ExplorerRegister';
import type {
  ApiExplorerRegisterCatalogResponseDto,
  ApiExplorerRegisterExploreRequestDto,
  ApiExplorerRegisterExploreResponseDto
} from './dtos/ExplorerRegisterDtos';
import {
  mapExplorerRegisterCatalogDto,
  mapExplorerRegisterExploreRequestDto,
  mapExplorerRegisterExploreResponseDto
} from './mappers/mapExplorerRegisterDto';

export class RestExplorerRegisterSource implements IExplorerRegisterSource {
  constructor(private readonly config: ApiClientConfig) {}

  async getCatalog(): Promise<IExplorerRegisterCatalog> {
    const response = await getJson<ApiExplorerRegisterCatalogResponseDto>(
      EXPLORER_REGISTER_API_ENDPOINTS.catalog,
      this.config
    );

    return mapExplorerRegisterCatalogDto(response);
  }

  async explore(
    payload: IExplorerRegisterExplorePayload
  ): Promise<IExplorerRegisterExploreData> {
    const response = await postJson<
      ApiExplorerRegisterExploreResponseDto,
      ApiExplorerRegisterExploreRequestDto
    >(
      EXPLORER_REGISTER_API_ENDPOINTS.explore,
      mapExplorerRegisterExploreRequestDto(payload),
      this.config
    );

    return mapExplorerRegisterExploreResponseDto(response);
  }
}
